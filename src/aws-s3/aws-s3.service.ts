import { BadRequestException, Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Injectable()
export class AwsS3Service {
  private bucketName;
  private s3;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey)
      throw new Error("Missing AWS configuration");

    this.s3 = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadImage(filePath: string, file) {
    if (!filePath || !file) {
      throw new Error("Missing file path or file");
    }
    const config = {
      Key: filePath,
      Bucket: this.bucketName,
      Body: file,
    };

    const uploadCommand = new PutObjectCommand(config);

    await this.s3.send(uploadCommand);
    return filePath;
  }

  async getImageByFileId(fileId: string) {
    if (!fileId) throw new BadRequestException("fileId is required");

    const config = {
      Key: fileId,
      Bucket: this.bucketName,
    };

    const getCommand = new GetObjectCommand(config);
    const fileStream = await this.s3.send(getCommand);

    if (fileStream.Body instanceof Readable) {
      const chunks: Uint8Array[] = [];
      for await (const chunk of fileStream.Body) {
        chunks.push(chunk);
      }

      const fileBuffer = Buffer.concat(chunks);

      const base64 = fileBuffer.toString("base64");

      const file = `data:${fileStream.ContentType};base64,${base64}`;

      return file;
    }
  }

  async deleteImageByFileId(fileId: string) {
    if (!fileId) throw new BadRequestException("fileId is required");

    const config: { Key: string; Bucket: any } = {
      Key: fileId,
      Bucket: this.bucketName,
    };

    const deleteCommand = new DeleteObjectCommand(config);
    await this.s3.send(deleteCommand);

    return `delete from ${this.bucketName}`;
  }
}
