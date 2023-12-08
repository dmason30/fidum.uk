import React from 'react';

export default function getFidumPackages() {
    try {
        const packages = [];
        const request = new XMLHttpRequest();

        request.open('GET', 'https://packagist.org/packages/list.json?vendor=fidum', false);
        request.send();

        if (request.status === 200) {
            const packageNames = JSON.parse(request.responseText).packageNames;

            for (const packageName of packageNames) {
                const packageInfoRequest = new XMLHttpRequest();
                packageInfoRequest.open('GET', `https://packagist.org/packages/${packageName}.json`, false);
                packageInfoRequest.send();

                if (packageInfoRequest.status === 200) {
                    const packageInfo = JSON.parse(packageInfoRequest.responseText).package;
                    const link = `https://github.com/${packageName}`;
                    packages.push({
                        link,
                        module: {
                            default: () => (
                                <React.Fragment>
                                    <a href={link} target="_blank">
                                        <img
                                            src={`https://opengraph.githubassets.com/1234/${packageName}`}
                                            alt={packageName}
                                            className="w-1/2"
                                        />
                                    </a>
                                </React.Fragment>
                            ),
                            meta: {
                                package: true,
                                title: packageInfo.name,
                                description: packageInfo.description,
                                link,
                                date: packageInfo.time,
                                authors: ['danmason']
                            }
                        }
                    });
                } else {
                    console.error(`Error fetching package ${packageName}: ${packageInfoRequest.statusText}`);
                }
            }

            console.log({ packages });
            return packages;
        } else {
            console.error(`Error fetching package names: ${request.statusText}`);
            return [];
        }
    } catch (error) {
        console.error('Error in getFidumPackages:', error.message);
        return [];
    }
}
