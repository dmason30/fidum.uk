import React from 'react';
import axios from 'axios';

const packages = [];

export default async function getFidumPackages() {
    if (packages.length) {
        return packages;
    }

    try {
        const response = await axios.get('https://packagist.org/packages/list.json?vendor=fidum');
        const packageNames = response.data.packageNames;

        for (const packageName of packageNames) {
            try {
                const packageInfoResponse = await axios.get(`https://packagist.org/packages/${packageName}.json`);
                const packageInfo = packageInfoResponse.data.package;
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
            } catch (error) {
                console.error(`Error fetching package ${packageName}: ${error.message}`);
            }
        }

        console.log({ packages });
        return packages;
    } catch (error) {
        console.error(`Error fetching package names: ${error.message}`);
        return [];
    }
}
