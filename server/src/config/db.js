var region = process.env.AWS_REGION || 'us-west-2';

module.exports = {
    region: region,
    endpoint: 'https://dynamodb.' + region + '.amazonaws.com'
};
