const {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const { isMockMode, s3Client, mockStore, config } = require('../config/aws');

class S3StorageService {
  async uploadDocument(key, content, contentType = 'application/json', metadata = {}) {
    const bucket = config.s3Bucket;

    if (isMockMode) {
      if (!mockStore.s3Buckets[bucket]) {
        mockStore.s3Buckets[bucket] = new Map();
      }
      const doc = {
        key,
        content,
        contentType,
        metadata,
        size: Buffer.byteLength(typeof content === 'string' ? content : JSON.stringify(content)),
        lastModified: new Date().toISOString(),
      };
      mockStore.s3Buckets[bucket].set(key, doc);
      return {
        ETag: '"mock-etag-' + Date.now() + '"',
        Location: `https://${bucket}.s3.${config.region}.amazonaws.com/${key}`,
        key,
      };
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: typeof content === 'string' ? content : JSON.stringify(content),
      ContentType: contentType,
      Metadata: metadata,
    });

    const response = await s3Client.send(command);
    return {
      ETag: response.ETag,
      Location: `https://${bucket}.s3.${config.region}.amazonaws.com/${key}`,
      key,
    };
  }

  async listDocuments(prefix = '') {
    const bucket = config.s3Bucket;

    if (isMockMode) {
      const bucketStore = mockStore.s3Buckets[bucket] || new Map();
      const docs = Array.from(bucketStore.values());
      return docs.filter((d) => d.key.startsWith(prefix));
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      });
      const response = await s3Client.send(command);
      return (response.Contents || []).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
      }));
    } catch (err) {
      console.error('Error listing S3 objects:', err.message);
      return [];
    }
  }
}

module.exports = new S3StorageService();
