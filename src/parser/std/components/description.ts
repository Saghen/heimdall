export enum DescriptionChunkType {
  Text = 'text',
  Image = 'image',
}

export type DescriptionChunk = {
  type: DescriptionChunkType
  content: string
  href?: string
}

export type Description = DescriptionChunk[]
