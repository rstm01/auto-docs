import { pipeline, env } from '@xenova/transformers';

// Отключаем локальные модели для Next.js, так как мы загружаем их из HuggingFace Hub
env.allowLocalModels = false;

class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static instance: any = null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    static async getInstance(progress_callback?: Function) {
        if (this.instance === null) {
            // Инициализация пайплайна
            // @ts-expect-error ignore pipeline signature mismatch
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Глобальный кэш векторов документов (сохраняется в памяти сервера между запросами в dev режиме)
declare global {
  var documentEmbeddingsCache: Map<string, number[]> | undefined;
}

const documentEmbeddingsCache = global.documentEmbeddingsCache || new Map<string, number[]>();
if (process.env.NODE_ENV !== "production") {
  global.documentEmbeddingsCache = documentEmbeddingsCache;
}

/**
 * Вычисляет косинусное сходство между двумя векторами
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Получает вектор (embedding) для заданного текста с помощью ИИ модели
 */
export async function getEmbedding(text: string): Promise<number[]> {
    const extractor = await PipelineSingleton.getInstance();
    // Генерируем вектор: используем pooling 'mean' и нормализуем (normalize: true)
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

export { documentEmbeddingsCache };
