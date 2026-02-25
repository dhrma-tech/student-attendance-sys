import os
import time
from twilio.rest import Client

# Load environment variables
TWILIO_SID = os.getenv('TWILIO_SID')
TWILIO_TOKEN = os.getenv('TWILIO_TOKEN')
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886' # Standard Twilio Sandbox number

client = Client(TWILIO_SID, TWILIO_TOKEN)

def send_absentee_alerts(absentees_list, subject, date):
    """
    Takes a list of dictionaries containing student data and sends WhatsApp alerts.
    """
    print(f"Initiating parent alerts for {len(absentees_list)} absent students...")

    for student in absentees_list:
        parent_number = student.get('parent_phone')
        student_name = student.get('name')
        
        # Ensure number is in E.164 format: e.g., +919876543210
        formatted_number = f"whatsapp:{parent_number}"
        
        message_body = (
            f"⚠️ *College Attendance Alert*\n\n"
            f"Dear Parent,\n"
            f"Your ward *{student_name}* was marked ABSENT for the *{subject}* lecture on {date}.\n\n"
            f"- Automated System"
        )

        try:
            message = client.messages.create(
                from_=TWILIO_WHATSAPP_NUMBER,
                body=message_body,
                to=formatted_number
            )
            print(f"✅ Alert sent to {student_name}'s parent. SID: {message.sid}")
            
        except Exception as e:
            print(f"❌ Failed to send alert for {student_name}. Error: {e}")
        
        # Rate limiting: Sleep for 1 second to avoid API spam filters
        time.sleep(1)

# Example usage trigger
if __name__ == "__main__":
    # In production, this data would be passed in as sys.argv or fetched from DB
    sample_absentees = [
        {"name": "Rahul", "parent_phone": "+919876543210"},
        {"name": "Sneha", "parent_phone": "+919876543211"}
    ]
    send_absentee_alerts(sample_absentees, "Fluid Mechanics", "25-Feb-2026")
