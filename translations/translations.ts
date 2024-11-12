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
  email_subject: string;
  email_greeting: string;
  email_body: string;
  email_success: string;
  name_email_required: string;
  report_sent_message: string;
  report_error_message: string;
  send_report_option: string;
  exit_button_text: string;
  farewell_message: string;
  report_title: string;
  report_thanks_message: string;
  report_email_subject: string;
  report_email_text: string;
  report_method_not_allowed: string;
  report_invalid_conversation: string;
  report_success_message: string;
  report_prompt: string;
  report_invalid_content_message: string;
  report_send_failure_message: string;
  report_generating:string;
  report_default_modal_message: string;
  farewell_message_with_logo: string;
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
    greeting_message: 'Hi! Let\'s talk about golf',
    start_placeholder: 'START HERE, say hello to GolfBallAssistant',
    click_for_details: 'Click for details',
    no_results_message: 'Here are your options',
    email_subject: 'Verify your email for GolfBallAssistant',
    email_greeting: 'Hello',
    email_body: 'Please verify your email by clicking the link below:',
    email_success: 'Verification email sent. Please check your inbox.',
    name_email_required: 'Name and email are required',
    report_sent_message: 'The report has been sent to your email. ',
    report_error_message: 'There was an error sending the report.',
    send_report_option: 'Send me a mail report',
    exit_button_text: 'Exit',
    farewell_message: 'May the birdies be with you!',
    report_title: 'Player:',
    report_thanks_message:'Thanks for visiting GolfBallAssistant.\n\nWe greatly appreciate any feedback you can give us about the app.\n\nDon\'t forget to share our site with your golf friends!',
    report_email_subject: 'Your Golf Ball Recommendations Report',
    report_email_text: 'We have attached a report summarizing what we discussed at golfballassistant. Come back soon!',
    report_method_not_allowed: 'Method not allowed',
    report_invalid_conversation: 'Invalid or missing conversation data',
    report_success_message: 'Report sent successfully',
    report_prompt: 'You are a golf ball expert. Yo generate a golf ball model recommendations report based on the following conversation and appealing to the characteristics of the ball models and linking them to those of the user, in Markdown format, using bullet points and headings where appropriate and adding a profesional style.',
    report_invalid_content_message: 'The generated report is invalid. Please try again later.',
    report_send_failure_message: 'There was a problem generating or sending the report. Please try again.',
    report_generating: 'The report is being generated...',
    report_default_modal_message: 'Processing your request...',
    farewell_message_with_logo: 'We hope the lakes spit out your golf balls. Have a great day!',
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
    greeting_message: '¿Qué tal? Cuéntame cómo es tu juego (golf)',
    start_placeholder: 'COMIENZA AQUÍ, díle algo a GolfBallAssistant',
    click_for_details: 'Ver detalles',
    no_results_message: 'Opciones disponibles',
    email_subject: 'Verifica tu correo electrónico para GolfBallAssistant',
    email_greeting: 'Hola',
    email_body: 'Verifica tu correo electrónico haciendo clic en el enlace a continuación:',
    email_success: 'Correo de verificación enviado. Por favor revisa tu bandeja de entrada.',
    name_email_required: 'Se requiere el nombre y el correo electrónico',
    report_sent_message: 'El informe ha sido enviado a tu correo. ',
    report_error_message: 'Hubo un error al enviar el informe.',
    send_report_option: 'Enviar copia a mi correo',
    exit_button_text: 'Salir',
    farewell_message: '¡Que los birdies te acompañen!',
    report_title: 'Jugador:',
    report_thanks_message: 'Gracias por visitar GolfBallAssistant. No olvides compartir nuestro site con tus amigos del golf!',
    report_email_subject: 'Su Informe de Recomendaciones de Pelotas de Golf',
    report_email_text: 'Hemos adjuntado un informe que sintetiza lo que hemos hablado en el golfballassistant. ¡Gracias por tu confianza!',
    report_method_not_allowed: 'Método no permitido',
    report_invalid_conversation: 'Datos de conversación inválidos o ausentes',
    report_success_message: 'Informe enviado exitosamente',
    report_prompt: 'Eres un experto en bolas de golf. Genera un informe de recomendaciones de modelos de bola de golf a partir de la siguiente conversación y vinculándolos a las características del usuario, en formato Markdown, utilizando viñetas y encabezados en su caso y añadiendo un estilo profesional',
    report_invalid_content_message: 'El informe generado no es válido. Inténtelo nuevamente más tarde',
    report_send_failure_message: 'Hubo un problema al generar o enviar el informe. Inténtelo nuevamente',
    report_generating: 'El informe se está generando...',
    report_default_modal_message: 'Procesando tu solicitud...',
    farewell_message_with_logo: 'Deseamos que los lagos escupan tus bolas de golf. Que tengas un día estupendo',

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
    start_placeholder: 'ESCRIU AQUÍ, digues hola a GolfBallAssistant',
    click_for_details: 'Veure més',
    no_results_message: 'Opcions disponibles',
    email_subject: 'Verifica el teu correu electrònic per GolfBallAssistant',
    email_greeting: 'Hola',
    email_body: 'Verifica el teu correu electrònic fent clic a l\'enllaç següent:',
    email_success: 'Correu de verificació enviat. Si us plau, comprova la teva safata d\'entrada.',
    name_email_required: 'Cal el nom i el correu electrònic',
    report_sent_message: 'L\'informe ha estat enviat al teu correu. ',
    report_error_message: 'Hi ha hagut un error en enviar l\'informe.',
    send_report_option: 'Enviar resultats per correu',
    exit_button_text: 'Sortir',
    farewell_message: 'Que els birdies t\'acompanyin!',
    report_title: 'Jugador:',
    report_thanks_message: 'Gràcies per visitar GolfBallAssistant. Valorem molt els comentaris que ens puguis fer arribar sobre la aplicació. No oblidis compartir el nostre site amb els teus amics del golf!',
    report_email_subject: 'El teu informe de recomanacions',
    report_email_text: 'Hem adjuntat un informe que sintetitza el que hem parlat al golfballassistant. Gràcies per la teva confiança!',
    report_method_not_allowed: 'Mètode no permès',
    report_invalid_conversation: 'Dades de conversa invàlides o inexistents',
    report_success_message: 'Informe enviat amb èxit',
    report_prompt: 'Ets un expert en pilotes de golf. Genereu un informe de recomanacions de models de pilota de golf a partir de la conversa següent i apel·lant a les característiques dels models de pilota i vinculant-los a les del usuari, en format Markdown, utilitzant vinyetes i encapçalaments si escau i afegint un estil professional',
    report_invalid_content_message: 'L\'informe generat no és vàlid. Intenteu-ho novament més tard',
    report_send_failure_message: 'Hi ha hagut un problema en generar o enviar l\'informe. Intenteu-ho novament',
    report_generating:'L\'informe s\'està generant...',
    report_default_modal_message: 'Processant la teva sol·licitud...',
    farewell_message_with_logo: 'Desitgem que els llacs escupin les teves boles de golf. Que tinguis un bon dia!',
  }
};
export default translations;


  
  