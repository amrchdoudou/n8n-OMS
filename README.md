# 🛒 WhatsApp Order Management System

Automated order management platform for Algerian e-commerce,
built with n8n, Shopify, DHD Ecotrack, and WhatsApp.

## 🚀 What it does
- Receives orders from Shopify via Webhook
- Confirms orders via WhatsApp automatically
- Creates shipments in DHD/Ecotrack API
- Saves tracking numbers to OMS database
- Syncs delivery status in real-time

## 🛠 Tech Stack
- **Automation:** n8n
- **E-commerce:** Shopify
- **Delivery:** DHD Ecotrack API
- **Database:** Custom OMS (n8n-oms.onrender.com)
- **Notifications:** WhatsApp Business API

## 📸 Screenshots
![Dashboard](<img width="1001" height="598" alt="Screenshot 2026-04-19 at 11 11 49" src="https://github.com/user-attachments/assets/241d0051-6011-4f58-9c3d-284e47295b48" />)
![Workflow](<img width="1277" height="728" alt="Screenshot 2026-04-19 at 11 11 08" src="https://github.com/user-attachments/assets/1383d50d-0049-42fd-a56b-0db114138cc2" />)

## 🔄 Workflow Architecture
1. Shopify Order → Webhook → n8n
2. n8n → WhatsApp confirmation call
3. Agent confirms → DHD API creates shipment
4. Tracking ID saved to OMS
5. Status sync every X minutes

## 📦 How to use
1. Import workflow JSONs into your n8n instance
2. Set your credentials (DHD token, WhatsApp API)
3. Connect your Shopify webhook URL
4. Deploy!

