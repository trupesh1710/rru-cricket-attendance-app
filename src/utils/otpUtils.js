import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID/public key
emailjs.init('pq9rl6ss1CvmYldsW');

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtpEmail = async (email, otp, templateId = 'template_xu4l70y') => {
  const templateParams = {
    email: email,
    otp_code: otp
  };

  try {
    console.log(`Sending OTP ${otp} to email ${email} using template ${templateId}`);
    const result = await emailjs.send('service_kpnifrd', templateId, templateParams);
    console.log('EmailJS send result:', result);
  } catch (err) {
    console.error('EmailJS send error:', err);
    // Log full error object for better debugging
    console.error('Full error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    throw new Error('Failed to send OTP email: ' + (err.text || err.message || 'Unknown error'));
  }
};
