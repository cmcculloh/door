import Head from "next/head";

export default function About() {
	return (
		<>
			<Head>
				<title>Contact</title>
				<meta name="description" content="Contact" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div>
					<p>Feel free to contact me!</p>
					<p>
						My name is Christopher McCulloh, and I am a member at Sts. Constantine &
						Elena Orthodox Church in Indianapolis, IN.
					</p>
					<p>
						Eventually I'll put some sort of webform up here, but for now, you can just
						do detective work.
					</p>
				</div>
			</main>
		</>
	);
}
