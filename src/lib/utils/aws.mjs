// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.mjs"; // Helper function that creates an Amazon S3 service client module.

const saveToS3 = async (bucket, key, body) => {
	const params = {
		Bucket: bucket,
		Key: key,
		Body: body,
	};

	try {
		const data = await s3Client.send(new PutObjectCommand(params));
		// console.log("Success", data);
		return data; // For unit tests.
	} catch (err) {
		console.log("Error", err);
	}
};

const getFromS3 = async (bucket, key) => {
	const params = {
		Bucket: bucket,
		Key: key,
	};

	try {
		const data = await s3Client.send(new GetObjectCommand(params));
		// console.log("Success", data);
		// Convert the ReadableStream to a string.
		return await data.Body.transformToString();
	} catch (err) {
		console.log("Error", err);
	}
};

export { saveToS3, getFromS3 };
