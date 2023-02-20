import Head from "next/head";
import Link from "next/link";

export default function About() {
	return (
		<>
			<Head>
				<title>About</title>
				<meta name="description" content="About" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div>
					<p>
						Daily Reading was created by{" "}
						<a href="https://cmcculloh.com">Christopher McCulloh</a>.
					</p>

					<p>
						It is so incredibly easy to get sucked into doomscrolling "the news" or your
						"feed" on Facebook/Twitter/Insta, I wanted a one-stop-shop where it is just
						as easy to get sucked into a more edifying infinite-scroll content feed.
					</p>

					<p>
						If you have Orthodox related content that you would like to see featured
						here, <Link href="/contact">drop us a line!</Link>.
					</p>
				</div>
			</main>
		</>
	);
}
