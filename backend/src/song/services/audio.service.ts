import { Injectable } from '@nestjs/common';

import { readFileSync } from 'fs';
import { decode } from 'node-wav';

import path from 'src/path';

@Injectable()
export class AudioService {
  public async wave(filename: string, len: 100 | 220): Promise<Array<number>> {
    const audio = this.getAudio(filename);

    const wave = [];
    const chunks = [];
    let sliceIndex = 0;

    // extract waveform
    const channelData = decode(audio).channelData;

    const isMono = !Boolean(channelData[1]);

    const channelBuffer = isMono
      ? channelData[0]
      : new Float32Array(channelData[0].length);

    if (!isMono) {
      const leftChannel = channelData[0];
      const rightChannel = channelData[1];

      for (let i = 0; i < leftChannel.length; i++) {
        channelBuffer[i] = (leftChannel[i] + rightChannel[i]) / 2;
      }
    }

    // set chunk size by specified length
    const chunkSize = Math.ceil(channelBuffer.length / len);

    // cut the waveform
    for (let i = 0; i < len; i++) {
      const chunk = [];

      channelBuffer.slice(sliceIndex, sliceIndex + chunkSize).forEach((xo) => {
        chunk.push(Math.abs(xo));
      });

      chunks.push(chunk);
      sliceIndex += chunkSize;
    }

    // fix the 'silent' or 'bad' chunks
    const fixChunks = chunks.map((chunk) =>
      chunk.reduce((a: number, b: number) => a + b, 0),
    );

    fixChunks.forEach((wv: number) => wave.push((wv / chunkSize) * 10));

    return wave;
  }

  private getAudio(filename: string) {
    const fullPath = path.storage.audio + filename;

    return readFileSync(fullPath);
  }
}
