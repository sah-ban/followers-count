# Farcaster Live Followers

This project is a Farcaster Frame built using [frames.js](https://framesjs.org/), the [Airstack](https://airstack.xyz/) validator and node package.

Farcaster Live Followers is a Farcaster Frame designed to get the live count of Farcaster Live Followers. It uses the Warpcast and Airstack API to fetch and display:

This tool is inspired by similar account analysis utilities and is built for simplicity and efficiency.

## Demo
Check out the live version at [https://warpcast.com](https://warpcast.com/cashlessman.eth/0x8e9158db).

## Features
- **Live Follower Count**: Displays the precise Live follewrs of a account.
## How It Works
- Just click on the "Check Me" button on the Frame.

## Installation

### Prerequisites
- Node.js (v20+ recommended)
- Airstack API key

### Steps
1. Clone this repository:
    ```bash
    git clone https://github.com/sah-ban/follows-back.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    - Create a .env file in the root directory with the following content:
      ```env
      AIRSTACK_API_KEY=your-airstack-api-key
      ```
Replace `your_airstack_api_key` with your actual Airstack API key.

## Local Development
To run the project locally:
```bash
npm run dev
```
This will start both the Next.js development server and the frames.js debugger.
## Deployment to Vercel
1.	Push your code to a GitHub repository.
2.	Connect your repository to Vercel.
3.	In the Vercel deployment settings, add the following environment variables:
    - AIRSTACK_API_KEY: Your Airstack API key
4.  Deploy the project.
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
## References
-  [frames.js Documentation](https://framesjs.org/)
-  [Vercel Deployment](https://vercel.com/docs/deployments/overview)
-  [Airstack API](https://docs.airstack.xyz/airstack-docs-and-faqs)
-  [TailwindCSS](https://tailwindcss.com/)
-  [Next.js](https://nextjs.org/)
