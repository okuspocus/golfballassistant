// translations.ts
export const translations: Record<'en' | 'es' | 'ca', { 
  meta_title: string; 
  meta_description: string; 
  persuasive_text: string; 
  question_text: string; 
  enter_details: string; 
  enter_name: string; 
  enter_email: string; 
  receive_promos: string; 
  privacy_policy: string; 
  agree_privacy: string; 
  error_valid_name_email: string; 
  error_name_too_long: string; 
  error_valid_email: string; 
  error_promos_agree: string; 
  error_privacy_policy_agree: string; 
  error_sending_email: string; 
  submit_text: string;
  greeting_message: string;
  start_placeholder: string;
  click_for_details: string;
  no_results_message: string;
}> = {
  en: {
    meta_title: 'AI Golf Ball Assistant - Find Your Perfect Golf Ball',
    meta_description: 'Use our AI-powered golf ball assistant to find the perfect golf ball for you.',
    persuasive_text: 'There is an ideal golf ball for every golfer.',
    question_text: 'Do you know which one is yours?',
    enter_details: 'Enter your details',
    enter_name: 'Enter your name...',
    enter_email: 'Enter your email...',
    receive_promos: 'I agree to receive mails sometimes (No spam)',
    privacy_policy: 'Privacy Policy',
    agree_privacy: 'I agree to the',
    error_valid_name_email: 'Please enter a valid name and email.',
    error_name_too_long: 'Name is too long. Please keep it under 50 characters.',
    error_valid_email: 'Please enter a valid email address.',
    error_promos_agree: 'You must agree to receive occasional emails.',
    error_privacy_policy_agree: 'You must accept the privacy policy to proceed.',
    error_sending_email: 'An error occurred while sending the email.',
    submit_text: 'Chat with our AI-Powered Assistant',
    greeting_message: 'Hi! Lets talk about golf',
    start_placeholder: 'START HERE, say hello to GolfBallAssistant',
    click_for_details: 'Click for details',
    no_results_message: 'Here your options'
  },
  es: {
    meta_title: 'Asistente de Pelotas de Golf - Encuentra tu Pelota Perfecta',
    meta_description: 'Usa nuestro asistente de pelotas de golf con IA para encontrar la pelota perfecta para ti.',
    persuasive_text: 'Hay una bola de golf ideal para cada jugador.',
    question_text: '¿Sabes cuál es la tuya?',
    enter_details: 'Introduce tus datos',
    enter_name: 'Introduce tu nombre...',
    enter_email: 'Introduce tu correo electrónico...',
    receive_promos: 'Acepto recibir correos (No spam)',
    privacy_policy: 'Política de Privacidad',
    agree_privacy: 'Acepto la',
    error_valid_name_email: 'Por favor, introduce un nombre y correo válidos.',
    error_name_too_long: 'El nombre es demasiado largo. Máximo 50 caracteres.',
    error_valid_email: 'Introduce una dirección de correo válida.',
    error_promos_agree: 'Debes aceptar recibir correos ocasionales.',
    error_privacy_policy_agree: 'Debes aceptar la política de privacidad.',
    error_sending_email: 'Hubo un error al enviar el correo.',
    submit_text: 'Habla con nuestro asistente con IA',
    greeting_message: 'Que tal? Cuéntame cómo es tu juego (golf)',
    start_placeholder: 'COMIENZA AQUÍ, díle algo a GolfBallAssistant',
    click_for_details: 'Ver detalles',
    no_results_message: 'Opciones disponibles'
  },
  ca: {
    meta_title: 'Assistent de Pilotes de Golf - Troba la Pilota Perfecta',
    meta_description: 'Utilitza el nostre assistent de pilotes de golf amb IA per trobar la pilota perfecta per a tu.',
    persuasive_text: 'Hi ha una bola de golf ideal per a cada jugador.',
    question_text: 'Saps quina és la teva?',
    enter_details: 'Entra les teves dades',
    enter_name: 'Entra el teu nom...',
    enter_email: 'Entra el teu correu electrònic...',
    receive_promos: 'Accepto rebre correus (No spam)',
    privacy_policy: 'Política de Privacitat',
    agree_privacy: 'Accepto la',
    error_valid_name_email: 'Si us plau, introdueix un nom i correu electrònic vàlids.',
    error_name_too_long: 'El nom és massa llarg. Màxim 50 caràcters.',
    error_valid_email: 'Introdueix una adreça de correu electrònic vàlida.',
    error_promos_agree: 'Has d\'acceptar rebre correus ocasionals.',
    error_privacy_policy_agree: 'Has d\'acceptar la política de privacitat.',
    error_sending_email: 'Hi ha hagut un error en enviar el correu.',
    submit_text: 'Parla amb el nostre assistent amb IA',
    greeting_message: 'Hey! Com anem? Com va el golf?',
    start_placeholder: 'ESCRIU AQUI, digues hola a GolfBallAssistant',
    click_for_details: 'Veure més',
    no_results_message: 'Opcions disponibles'
  }
};
export default translations;

  
  