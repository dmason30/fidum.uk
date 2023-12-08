import tinytime from 'tinytime'
import Link from 'next/link'
import Head from 'next/head'
import getAllPostPreviews from '@/getAllPostPreviews'
import twitterCard from '@/img/twitter-card.png'

const posts = getAllPostPreviews()

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

export default function Home() {
  return (
    <div className="divide-y divide-gray-200">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@danmasonmp" />
        <meta name="twitter:creator" content="@danmasonmp" />
        <meta name="twitter:title" content="Blog – Fidum" />
        <meta name="twitter:description" content="Discoveries by developer Dan Mason in the world of Laravel, PHP and all software engineering." />
        <meta name="twitter:image" content={`https://fidum.uk${twitterCard}`} />
        <meta property="og:url" content="https://fidum.uk" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Blog – Fidum" />
        <meta property="og:description" content="Discoveries by developer Dan Mason in the world of Laravel, PHP and all software engineering." />
        <meta property="og:image" content={`https://fidum.uk${twitterCard}`} />
        <title>Blog – Fidum</title>
        <meta name="description" content="Discoveries by developer Dan Mason in the world of Laravel, PHP and all software engineering." />
      </Head>
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
        </h1>
        <p className="text-lg leading-7 text-gray-500">
            Discoveries by developer Dan Mason in the world of Laravel, PHP and all software engineering.
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {posts.map(({ link, module: { default: Component, meta } }, i) => {
          return (
            <li key={i} className="py-12">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-cyan-500">
                    <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
                    <div className="text-black">
                        {meta.package ? (
                            <div className="px-2 rounded-lg bg-blue-100 text-xs w-max-content">
                                package
                            </div>
                        ) : (
                            <div className="px-2 rounded-lg bg-green-100 text-xs w-max-content">
                                post
                            </div>
                        )}
                    </div>
                  </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                  <div className="space-y-6">
                    <h2 className="text-2xl leading-8 font-bold tracking-tight">
                        {meta.package ? (
                            <a href={link} className="hover:underline">
                                {meta.description}
                            </a>
                        ) : (
                            <Link href={link}>
                                <a className="text-gray-900 hover:underline">{meta.title}</a>
                            </Link>
                        )}
                    </h2>
                    <div className="prose max-w-none text-gray-500">
                      <Component />
                    </div>
                  </div>
                  <div className="text-base leading-6 font-medium">
                      {meta.package ? null : (
                          <Link href={link}>
                              <a
                                  className="text-cyan-500"
                                  aria-label={`Read "${meta.title}"`}
                              >
                                  Read more &rarr;
                              </a>
                          </Link>
                      )}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
