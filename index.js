const fs = require('fs');
const {runLoaders} = require('loader-runner');

module.exports = async function lazyLoader(source) {
    const callback = this.async();

    const {loader, type, options} = await this.getOptions().resolveLoader();
    const runOptions = {
        resource: this.resource,
        loaders: [
            {loader, type},
        ],
        context: {
            getOptions: () => options,
        },
        readResource: (resource, data) => {
            if (source == null) {
                const fs = this.fs ?? fs;
                fs.readFile(resource, data);
            }

            return Buffer.from(source);
        },
    };

    runLoaders(
        runOptions,
        (err, {result, fileDependencies, cacheable, contextDependencies, missingDependencies}) => {
            if (err) {
                callback(err);
                return;
            }

            this.cacheable(cacheable);
            missingDependencies.forEach(v => this.addMissingDependency(v));
            fileDependencies.forEach(v => this.addDependency(v));
            contextDependencies.forEach(v => this.addContextDependency(v));
            callback(null, ...result);
        }
    );
}
