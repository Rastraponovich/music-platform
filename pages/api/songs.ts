// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = [
    [
      {
        id: 1,
        name: "Apache",
        artist: "Mayel",
        isActive: true,
        path: "5b0c8552-6b88-4ac6-b4c5-01c8ffcf3303.mp3",
        cover: "5fe94c43-39c7-44bc-989e-75cd304866e5.jpg",
        likes: 0,
        userId: 5,
        createdAt: "2022-01-31T07:08:41.208Z",
        updatedAt: "2022-01-31T07:08:41.208Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: ["ID3v2.4"],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 320000,
            codecProfile: "CBR",
            duration: 295.86285714285714,
          },
          native: { "ID3v2.4": [{ id: "TSSE", value: "Lavf57.71.100" }] },
          quality: {
            warnings: [
              {
                message: "Invalid ID3v2.4 frame-header-ID: \u0000\u0000\u0000\u0000",
              },
              {
                message: "id3v2.4 header has empty tag type=\u0000\u0000\u0000\u0000",
              },
            ],
          },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
            encodersettings: "Lavf57.71.100",
          },
        },
      },
      {
        id: 2,
        name: "Pocket Rocket",
        artist: "Nic ZigZag",
        isActive: true,
        path: "7f2ddd70-73a5-45a2-83af-1cd3d93c9bf4.mp3",
        cover: "45873410-acdc-4dd5-b22a-c1cabcd28f9e.png",
        likes: 0,
        userId: 5,
        createdAt: "2022-02-03T04:24:44.925Z",
        updatedAt: "2022-02-03T04:24:44.925Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: [],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 320000,
            tool: "LAME 3.99.5",
            codecProfile: "CBR",
            numberOfSamples: 13991040,
            duration: 317.25714285714287,
          },
          native: {},
          quality: { warnings: [] },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
          },
        },
      },
      {
        id: 3,
        name: "Feel The Vibe",
        artist: "DJ Kuba, Neitan",
        isActive: true,
        path: "b0302067-a6ab-4ece-8f98-f635c9611f94.mp3",
        cover: "a7509bed-06da-45cf-ab6a-79c5e17e98af.jpg",
        likes: 0,
        userId: 5,
        createdAt: "2022-02-07T10:18:47.582Z",
        updatedAt: "2022-02-07T10:18:47.582Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: [],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 320000,
            codecProfile: "CBR",
            numberOfSamples: 6554880,
            duration: 148.63673469387754,
          },
          native: {},
          quality: { warnings: [] },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
          },
        },
      },
      {
        id: 4,
        name: " Otherside",
        artist: "Monolink",
        isActive: true,
        path: "9baf25af-33ea-4525-bfc6-6500b06c3403.mp3",
        cover: "2698da99-7319-48ee-a517-88de0f52b6f3.jpg",
        likes: 0,
        userId: 5,
        createdAt: "2022-02-07T10:19:42.180Z",
        updatedAt: "2022-02-07T10:19:42.180Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: [],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 160000,
            codecProfile: "CBR",
            numberOfSamples: 11642112,
            duration: 263.9934693877551,
          },
          native: {},
          quality: { warnings: [] },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
          },
        },
      },
      {
        id: 5,
        name: "Dragon Slayer",
        artist: "Mizo",
        isActive: true,
        path: "a54be8ae-ce15-496e-b7a8-94eaa14de0d8.mp3",
        cover: "7da6a097-f23e-45fe-a380-0b098fca77a0.jpg",
        likes: 0,
        userId: 5,
        createdAt: "2022-02-07T10:20:53.796Z",
        updatedAt: "2022-02-07T10:20:53.796Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: [],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 320000,
            codecProfile: "CBR",
            numberOfSamples: 13142016,
            duration: 298.00489795918367,
          },
          native: {},
          quality: { warnings: [] },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
          },
        },
      },
      {
        id: 6,
        name: "Return to Oz",
        artist: "Monolink",
        isActive: true,
        path: "2c8915f0-de3d-4d9e-9a3f-378bf2d0906f.mp3",
        cover: "65ebe4a9-a31f-45be-bbdd-438ce214d934.jpg",
        likes: 0,
        userId: 5,
        createdAt: "2022-02-07T10:30:27.082Z",
        updatedAt: "2022-02-07T10:30:27.082Z",
        deletedAt: null,
        comments: [],
        metaData: {
          format: {
            tagTypes: [],
            trackInfo: [],
            lossless: false,
            container: "MPEG",
            codec: "MPEG 1 Layer 3",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitrate: 320000,
            codecProfile: "CBR",
            numberOfSamples: 21169152,
            duration: 480.0261224489796,
          },
          native: {},
          quality: { warnings: [] },
          common: {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: {},
          },
        },
      },
    ],
    6,
  ];

  res.status(200).json(result);
}
