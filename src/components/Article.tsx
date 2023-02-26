import { FC } from 'react';
import { useState } from 'react';
import Icon from './Icon';

type Props = {
    title: string;
    date: string;
    contents: string;
    source: string;
}

const Article: FC<Props> = ({ title, date, contents, source }) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleContent = () => {
        setCollapsed(!collapsed);
    }
    return (
		<article>
			<header onClick={() => toggleContent()} className="slds-grid">
				<h2 className="slds-col">{title}</h2>
				<Icon
					classNames="slds-m-top_x-small"
					type={collapsed ? "chevronright" : "chevrondown"}
					size="x-small"
				/>
			</header>
			<div className={collapsed ? "slds-hide" : ""}>
				{/* TODO: Find a way to make it so that if the article contains a relative link, we can make it absolute */}
				<div dangerouslySetInnerHTML={{ __html: contents }} />
				<p className="source">
					Original Source: <a href={source}>{source}</a>
					<br />
					Originally Posted: {new Date(date).toISOString().slice(0, 10)}
				</p>
			</div>
		</article>
	);
}

export default Article;