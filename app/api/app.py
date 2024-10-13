import json
import requests
import os
import time
import threading  # To handle locking and throttling
from flask import Flask, request, jsonify
from flask_cors import CORS
from aws_v4 import AWSV4  # Assuming AWSV4 is the class handling AWS V4 signing

app = Flask(__name__)
CORS(app)

# Constants for the AWS API
SERVICE_NAME = "ProductAdvertisingAPI"
REGION = "eu-west-1"
HOST = "webservices.amazon.es"
URI_PATH = "/paapi5/searchitems"

# Load AWS credentials from environment variables
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_DAN")
SECRET_KEY = os.getenv("AWS_SECRET_KEY_DAN")

if not ACCESS_KEY or not SECRET_KEY:
    raise ValueError("AWS credentials are not defined in environment variables.")

# Create a lock to limit concurrent requests
request_lock = threading.Lock()
processed_requests = 0
is_throttled = False  # To keep track of when to throttle requests


@app.route('/search', methods=['POST'])
def search():
    global processed_requests, is_throttled

    # Acquire the lock to manage request counting
    with request_lock:
        # Check if throttling is active
        if is_throttled:
            return jsonify({"error": "Server is throttling. Please wait 8 seconds before making new requests."}), 429
        
        # Increment the number of processed requests
        processed_requests += 1

        # If this is the second request, activate throttling
        if processed_requests >= 2:
            processed_requests = 0  # Reset the counter
            is_throttled = True

            # Start a timer to release the throttle after 8 seconds
            def release_throttle():
                global is_throttled
                time.sleep(5)
                is_throttled = False

            # Run the throttle release in a separate thread
            threading.Thread(target=release_throttle).start()

    # Process the request independently without waiting for the second request
    data = request.json
    keywords = data.get("keywords")

    if not keywords:
        return jsonify({"error": "Missing 'keywords' in request."}), 400

    # Create the payload for the AWS API
    payload = {
        "Keywords": keywords,
        "Resources": [
            "Images.Primary.Small",
            "ItemInfo.Title",
            "Offers.Listings.Price"
        ],
        "SearchIndex": "All",
        "PartnerTag": "bolasgolf0d-21",
        "PartnerType": "Associates",
        "Marketplace": "www.amazon.es",
        "ItemCount": 2
    }

    awsv4 = AWSV4(ACCESS_KEY, SECRET_KEY)
    awsv4.set_region_name(REGION)
    awsv4.set_service_name(SERVICE_NAME)
    awsv4.set_path(URI_PATH)
    awsv4.set_payload(json.dumps(payload))
    awsv4.set_request_method("POST")

    # Add necessary headers
    awsv4.add_header('content-encoding', 'amz-1.0')
    awsv4.add_header('content-type', 'application/json; charset=utf-8')
    awsv4.add_header('host', HOST)
    awsv4.add_header('x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems')

    # Get the signed headers for the request
    headers = awsv4.get_headers()

    # Make the request to the AWS API
    response = requests.post(f"https://{HOST}{URI_PATH}", headers=headers, json=payload)

    # Process and return the response
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": f"{response.status_code} - {response.text}"}), response.status_code


if __name__ == "__main__":
    app.run(debug=True)



