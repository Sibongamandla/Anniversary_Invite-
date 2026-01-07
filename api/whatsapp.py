import os
import requests
import json

# Load config
PHONE_ID = os.getenv("WHATSAPP_PHONE_ID")
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
VERSION = "v17.0"

def send_text_message(to_number: str, text: str):
    """
    Sends a simple text message via WhatsApp Cloud API.
    Note: If the usage window is closed (24h), this might fail unless using a template.
    For this anniversary app, we assume we are within window or user initiated.
    For production "Notifications", templates are safer.
    """
    if not PHONE_ID or not ACCESS_TOKEN:
        print("[WhatsApp] Credentials missing. Skipping send.")
        return False

    url = f"https://graph.facebook.com/{VERSION}/{PHONE_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # Remove non-digits from number
    clean_number = "".join(filter(str.isdigit, to_number))
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": clean_number,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"[WhatsApp] Sent to {clean_number}: Success")
        return True
    except requests.exceptions.RequestException as e:
        print(f"[WhatsApp] Failed to send to {clean_number}: {e}")
        if e.response:
            print(f"[WhatsApp] Response: {e.response.text}")
        return False
