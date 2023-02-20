Getting the s3 stuff set up:

1. Created s3 user.
2. Created s3 bucket.
2. Created IAM user.
3. Created Access Key for IAM user.
4. Made .env.local file and put the following in there:
    AWS_ACCESS_KEY_ID = <keyid>
    AWS_SECRET_ACCESS_KEY = <secret>
5. Edited bucket permissions to add the following CORS policy:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD",
            "POST",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```
6. Added keys as ENV secrets in Vercel



This was helpful: https://devcenter.heroku.com/articles/s3-upload-node