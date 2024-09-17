function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

function multiplyVectorsSequentially(v1, v2) {
    const result = new Array(v1.length);
    const startTime = Date.now();

    for (let i = 0; i < v1.length; i++) {
        result[i] = v1[i] * v2[i];
        const startPause = Date.now();
        while (Date.now() - startPause < 1) {} 
    }

    const endTime = Date.now();
    return `Tempo de execução (sequencial): ${endTime - startTime} ms`;
}

function multiplyVectorsParallel(v1, v2) {
    const numThreads = 2;
    const chunkSize = Math.ceil(v1.length / numThreads);
    const workers = [];
    const results = new Array(v1.length);
    const startTime = Date.now();

    return new Promise((resolve) => {
        let completedWorkers = 0;

        for (let i = 0; i < numThreads; i++) {
            const worker = new Worker('worker.js');
            workers.push(worker);

            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, v1.length);

            worker.postMessage({ v1, v2, start, end });

            worker.onmessage = function(event) {
                const resultChunk = event.data;
                for (let j = 0; j < resultChunk.length; j++) {
                    results[start + j] = resultChunk[j];
                }
                completedWorkers++;
                if (completedWorkers === numThreads) {
                    const endTime = Date.now();
                    resolve(`Tempo de execução (paralelo): ${endTime - startTime} ms`);
                }
            };
        }
    });
}

document.getElementById('startSequential').addEventListener('click', () => {
    const size = 500;
    const vector1 = generateRandomArray(size);
    const vector2 = generateRandomArray(size);

    const result = multiplyVectorsSequentially(vector1, vector2);
    document.getElementById('result').textContent = result;
});

document.getElementById('startParallel').addEventListener('click', async () => {
    const size = 500;
    const vector1 = generateRandomArray(size);
    const vector2 = generateRandomArray(size);

    const result = await multiplyVectorsParallel(vector1, vector2);
    document.getElementById('result').textContent = result;
});
