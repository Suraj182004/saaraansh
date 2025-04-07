# 📄 Saaraansh - AI-Powered PDF Summarizer ✨



Saaraansh is an advanced AI-powered application that transforms lengthy PDFs into concise, actionable summaries within seconds. Save hours of reading time while retaining all key information from your documents

🚀 **Live Demo**: [[https://saaraansh-g1r2.onrender.com/](https://saaraansh-g1r2.onrender.com/)](https://saaraansh-summarizer.vercel.app/)

## ✨ Features

- 🤖 **AI-Powered Summaries**: Advanced AI extracts key points from any PDF document
- ⚡ **Lightning Fast**: Get your summaries in seconds, not minutes
- 🔒 **Private & Secure**: Your documents are encrypted and processed securely
- 📏 **Custom Summary Length**: Choose between brief overviews or detailed summaries
- 💾 **Export Options**: Download summaries in multiple formats
- ⏱️ **Time Saving**: Reduce hours of reading to minutes
- 💰 **Tiered Pricing Plans**: Free, Basic, and Pro options available

## 🛠️ Built With

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **AI Integration**: [Google Generative AI](https://cloud.google.com/generative-ai)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Render](https://render.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/saaraansh.git
   cd saaraansh
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # File Upload
   UPLOADTHING_TOKEN=your_uploadthing_token
   
   # AI
   GOOGLE_API_KEY=your_google_api_key
   
   # Database
   DATABASE_URL=your_postgres_connection_string
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_BASIC_PRICE_ID=your_stripe_basic_price_id
   STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
   NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=your_stripe_basic_price_id
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📊 Project Structure

```
saaraansh/
├── actions/         # Server actions
├── app/             # Next.js application routes
├── components/      # Reusable UI components
├── lib/             # Utility functions and libraries
│   ├── db/          # Database configuration
├── public/          # Static assets
├── styles/          # Global styles
└── utils/           # Helper functions
```

## 🌐 Deployment

The application is deployed on [Render](https://render.com/). To deploy your own instance:

1. Push your code to a GitHub repository
2. Create a new Web Service in Render
3. Connect your GitHub repository
4. Configure environment variables in the Render dashboard
5. Deploy

## 📝 How It Works

Saaraansh works in three simple steps:

1. 📤 **Upload your PDF**: Simply drag and drop your PDF document or select it from your files
2. 🔍 **AI Processing**: Our advanced AI reads and analyzes your document, identifying key information
3. 📋 **Get your summary**: Receive a concise, well-structured summary highlighting the most important points

## 💰 Pricing Plans

- **Free**: 10 PDF summaries per month, standard processing speed
- **Basic** ($9/month): 50 PDF summaries per month, standard processing speed, email support
- **Pro** ($19/month): Unlimited PDF summaries, priority processing, 24/7 support, markdown export

## 🔐 Security & Privacy

- All documents are encrypted during transit and processing
- We do not store your documents after processing is complete
- We never share your information with third parties

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- Email: contact@saaraansh.com
- Website: [https://saaraansh-g1r2.onrender.com/](https://saaraansh-g1r2.onrender.com/)

---

<p align="center">Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
