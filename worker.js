self.onmessage = function(event) {
    const { v1, v2, start, end } = event.data;
    const result = new Array(end - start);

    for (let i = start; i < end; i++) {
        result[i - start] = v1[i] * v2[i];
        const startPause = Date.now();
        while (Date.now() - startPause < 1) {} 
    }

    self.postMessage(result);
};
