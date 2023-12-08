import fs from 'fs'
import RSS from 'rss'
import getAllPostPreviews from '../src/getAllPostPreviews'

getAllPostPreviews().then((posts) => {
  const feed = new RSS({
    title: 'Blog – Tailwind CSS',
    site_url: 'https://fidum.uk',
    feed_url: 'https://fidum.uk/feed.xml',
  })

  posts.forEach(({ link, module: { meta } }) => {
    feed.item({
      title: meta.title,
      guid: link,
      url: meta.package ? link : `https://fidum.uk${link}`,
      date: meta.date,
      description: meta.description,
      custom_elements: [].concat(meta.authors.map((author) => ({ author: [{ name: author.name }] }))),
    })
  })

  fs.writeFileSync('./out/feed.xml', feed.xml({ indent: true }))
});
