# Deployment Guide

This guide will walk you through deploying the Aptos Music Platform to production.

## Prerequisites

- Node.js 18+ installed
- Aptos CLI installed
- An Aptos wallet with APT tokens
- A domain name (for production)
- A server or cloud platform (AWS, Vercel, etc.)

## Step 1: Environment Setup

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your production values:
```env
# Aptos Configuration
APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
MODULE_ADDRESS=your_deployed_module_address
PRIVATE_KEY=your_private_key

# Frontend Configuration
VITE_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
VITE_MODULE_ADDRESS=your_deployed_module_address

# Backend Configuration
PORT=3001
NODE_ENV=production
```

## Step 2: Deploy Smart Contract

1. Build the contract:
```bash
cd contracts
aptos move compile
```

2. Deploy to mainnet:
```bash
cd ../backend
npm run deploy
```

3. Note the deployed module address and update your `.env` file.

## Step 3: Deploy Backend API

### Option A: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd backend
vercel --prod
```

### Option B: Deploy to AWS

1. Create an EC2 instance
2. Install Node.js and PM2
3. Clone your repository
4. Install dependencies:
```bash
npm install
```

5. Start with PM2:
```bash
pm2 start scripts/dev-server.js --name "music-api"
pm2 save
pm2 startup
```

### Option C: Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

## Step 4: Deploy Frontend

### Option A: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

### Option B: Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

### Option C: Deploy to AWS S3 + CloudFront

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Upload to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure CloudFront for CDN

## Step 5: Configure Domain

1. Point your domain to your deployment
2. Configure SSL certificates
3. Update CORS settings in backend if needed

## Step 6: Environment Variables for Production

### Frontend (Vercel/Netlify)

Set these environment variables in your deployment platform:

- `VITE_APTOS_NODE_URL`
- `VITE_MODULE_ADDRESS`

### Backend

Set these environment variables:

- `APTOS_NODE_URL`
- `MODULE_ADDRESS`
- `PRIVATE_KEY` (keep secure!)
- `PORT`
- `NODE_ENV`

## Step 7: Monitoring and Maintenance

### Set up monitoring:

1. **Error tracking**: Use Sentry or similar
2. **Analytics**: Google Analytics or Plausible
3. **Uptime monitoring**: UptimeRobot or Pingdom
4. **Logs**: Use your platform's logging service

### Regular maintenance:

1. **Update dependencies**: Run `npm audit` and update packages
2. **Monitor gas fees**: Track Aptos transaction costs
3. **Backup data**: Regular backups of any off-chain data
4. **Security audits**: Regular security reviews

## Production Checklist

- [ ] Smart contract deployed to mainnet
- [ ] Environment variables configured
- [ ] Backend API deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Domain configured with SSL
- [ ] CORS properly configured
- [ ] Error tracking set up
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team access configured

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured for your frontend domain
2. **Wallet connection issues**: Check if wallet adapter is properly configured
3. **Transaction failures**: Verify gas fees and account balance
4. **API timeouts**: Check Aptos node URL and network connectivity

### Debug Commands

```bash
# Check contract status
aptos move view --function-id $MODULE_ADDRESS::players::get_platform_stats

# Check account balance
aptos account list --account $YOUR_ADDRESS

# View transaction
aptos transaction show --hash $TRANSACTION_HASH
```

## Security Considerations

1. **Private keys**: Never commit private keys to version control
2. **Environment variables**: Use secure methods to store sensitive data
3. **Input validation**: Validate all user inputs
4. **Rate limiting**: Implement rate limiting for API endpoints
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS properly to prevent unauthorized access

## Performance Optimization

1. **CDN**: Use a CDN for static assets
2. **Caching**: Implement caching for API responses
3. **Database**: Use a database for off-chain data if needed
4. **Image optimization**: Optimize images and assets
5. **Code splitting**: Implement code splitting in frontend

## Backup and Recovery

1. **Smart contract**: The contract is immutable once deployed
2. **Off-chain data**: Regular backups of any off-chain data
3. **Configuration**: Version control all configuration files
4. **Documentation**: Keep deployment documentation updated

## Support

For issues and support:

1. Check the troubleshooting section
2. Review Aptos documentation
3. Check GitHub issues
4. Contact the development team