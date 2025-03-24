import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "art-gallery-f4b4f",
      clientEmail:
        "firebase-adminsdk-fbsvc@art-gallery-f4b4f.iam.gserviceaccount.com",

      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdx17amGUtGCOq\n0X+NSVRlviRoFJam3MepGu1/tfLqbJoqukkCF2+aFYYnYmN0g5W8j6Vrv3jrCcr6\nql9Nw5qz+AfPsI+AcVehuhc+NxSLqdWtpg/B3nMrId6OwujAw6jIvYOmysZ0PZB1\npxvAIuWuZpcX6QYjrmGbZymey3HkdcKVRUS+zX4LC3EDVldj/g+8V0Lqh/33ipSh\nig1HiONriVymql6qC0bY3WDKxqvCMPqKoYfkO5M9C6XkFpKbbSdnC75bsqVZGXmS\ndsOFdbTFRkkenum4HM+988e+9Y66dnbtmEE7NIZpZ0WvQCXjomSkug4h8WUQYcOj\nJ+MaeUg5AgMBAAECggEABATvrCbksOzj/7Z9htZe4Yah+8rGebK3HV4zvaSfbwxc\nMwly0axSKf0xYTB28yFk/5wzLRcAGBC0TIVpjxwUBVCktkw7o5x/jH2mmO2jRtmJ\nOXa5AQnPKkKfHkjlz/9L/e0h/O4+dviYhP7ATLk226X+ZFwJzX/kOaa7nzF0kcrJ\n4/W5kAUfytWcKUh4c2HMw6ox6sbbbDnz0JxTxQUJh45l2SO0qrHzEVxzRcG+secy\nQ8XUtVHmFd9+vfffFCnb9IXQSTt3ccs9na5nixxLQSwx9/nBpBYmwadwcXSio5JN\nU4VdYkDvEVMOCKhRsiK0pq1JnpNV3NV+4h6qeoNpwQKBgQDdfww20EJe9DC3aeLG\nLxq9RRqs+GcsM5q3UnQvO6tX0ejxzw7iij3e+vNqsz4UPwGHXlKarzBVeKSNqjeR\nn/IU4TtDYX88RfdRECOa2O9NMAFueMPyT6xLY3UbRf+W0sCQIY3Mh/Fkpz0dHTfb\nqwLM/IXffFO0FsYCUUYe1Sg/qQKBgQC2W1x47NP8hIHJ8kqW+rvkOF+wGDDjsXqN\nt1WZJNALPaJZR3XLCFLY6C9TrIADIkqkUrSETMuLFdBEi/eH6mSXBqelD9wOfOi/\nGarpRAyY4wULE7A+WfsVSfsX+sAhvCvVzbLCp7aMD0aMSP0eX4KRPBvovsVDKHmu\nNh60OCVeEQKBgQClexzh+tgLXv7imR5PGLQugel7Hx7d3DQUEGszOq45r18NAbhK\nMiQlanHf3shbkfMPcr3eSVKgGMFAAdMAXnIbfWasYbQQkOlES/192+N1VI9NPLaQ\nW0wLCuRcGwDoas5pIFhzXYFQxM2Y6dJosKwn/+X44Ucb/gOziYsM0A4A+QKBgDpo\nUtsMh+2Gh4emSkvHbWzwvX1KkkYrr2Q6x3jwuI4RJLHR2KG6Pcbpv1belnXqgtvU\n/aquajdXOkjqR9NJuQRChmmxBbvCOE4VK4/hUuOZOyFMIhQmf+xWsM0CbI2hlqy5\nYLtGOorrzZ3bNu+Giex4wzut9sLG8QpinTz+CsHxAoGBALFgG1c803Dov//H8fjq\nqOlmzeCRs1un+jmurPSDreCX4wHOeq7oA7tBR+o+HFSdcjoHOJnpCuYY9nRgAqOw\nyRe0pTWa5+ttTcumdEoyBxI9DoSdTu9FJPzl6R7eEtJaytCxHgNFKx7fcJnsEQkQ\n37EQeCM+9xHy7h3JZd4d4YXS\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://art-gallery-f4b4f.firebaseio.com",
  });
}

const admindb = admin.firestore();
export { admindb };
