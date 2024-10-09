# aws_v4_signing.py

import hashlib
import hmac
import datetime
from collections import OrderedDict

class AWSV4:
    def __init__(self, access_key, secret_key):
        self.access_key = access_key
        self.secret_key = secret_key
        self.path = None
        self.region_name = None
        self.service_name = None
        self.http_method_name = None
        self.aws_headers = {}
        self.payload = ""
        self.hmac_algorithm = "AWS4-HMAC-SHA256"
        self.aws4_request = "aws4_request"
        self.x_amz_date = self.get_timestamp()
        self.current_date = self.get_date()
        self.signed_headers = None

    def set_path(self, path):
        self.path = path

    def set_service_name(self, service_name):
        self.service_name = service_name

    def set_region_name(self, region_name):
        self.region_name = region_name

    def set_payload(self, payload):
        self.payload = payload

    def set_request_method(self, method):
        self.http_method_name = method

    def add_header(self, header_name, header_value):
        self.aws_headers[header_name] = header_value

    def prepare_canonical_request(self):
        canonical_request = f"{self.http_method_name}\n{self.path}\n\n"
        signed_headers = ''
        for key, value in self.aws_headers.items():
            signed_headers += f"{key};"
            canonical_request += f"{key}:{value}\n"
        canonical_request += "\n"
        self.signed_headers = signed_headers[:-1]
        canonical_request += f"{self.signed_headers}\n"
        canonical_request += self.generate_hex(self.payload)
        return canonical_request

    def prepare_string_to_sign(self, canonical_request):
        string_to_sign = f"{self.hmac_algorithm}\n"
        string_to_sign += f"{self.x_amz_date}\n"
        string_to_sign += f"{self.current_date}/{self.region_name}/{self.service_name}/{self.aws4_request}\n"
        string_to_sign += self.generate_hex(canonical_request)
        return string_to_sign

    def calculate_signature(self, string_to_sign):
        signature_key = self.get_signature_key(self.secret_key, self.current_date, self.region_name, self.service_name)
        signature = hmac.new(signature_key, string_to_sign.encode('utf-8'), hashlib.sha256).digest()
        return signature.hex()

    def get_headers(self):
        self.aws_headers['x-amz-date'] = self.x_amz_date
        sorted_headers = OrderedDict(sorted(self.aws_headers.items()))
        self.aws_headers = sorted_headers

        canonical_request = self.prepare_canonical_request()
        string_to_sign = self.prepare_string_to_sign(canonical_request)
        signature = self.calculate_signature(string_to_sign)

        self.aws_headers['Authorization'] = self.build_authorization_string(signature)
        return self.aws_headers

    def build_authorization_string(self, signature):
        return f"{self.hmac_algorithm} Credential={self.access_key}/{self.current_date}/{self.region_name}/{self.service_name}/{self.aws4_request}, SignedHeaders={self.signed_headers}, Signature={signature}"

    def generate_hex(self, data):
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    def get_signature_key(self, key, date, region_name, service_name):
        k_secret = f"AWS4{key}".encode('utf-8')
        k_date = hmac.new(k_secret, date.encode('utf-8'), hashlib.sha256).digest()
        k_region = hmac.new(k_date, region_name.encode('utf-8'), hashlib.sha256).digest()
        k_service = hmac.new(k_region, service_name.encode('utf-8'), hashlib.sha256).digest()
        k_signing = hmac.new(k_service, self.aws4_request.encode('utf-8'), hashlib.sha256).digest()
        return k_signing

    def get_timestamp(self):
        return datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    def get_date(self):
        return datetime.datetime.utcnow().strftime("%Y%m%d")
