import { FC } from 'react';
import { useState } from 'react';
import Icon from './Icon';

type Props = {
    title: string;
    date: string;
    content: string;
    source: string;
}

const Article: FC<Props> = ({ title, date, content, source }) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleContent = () => {
        setCollapsed(!collapsed);
    }
    return (
		<article>
			<header
				onClick={() => toggleContent()}
				className="slds-grid"
			>
				<h2 className="slds-col">{title}</h2>
				<Icon
					classNames="slds-m-top_x-small"
					type={collapsed ? "chevronright" : "chevrondown"}
					size="x-small"
				/>
			</header>
			<div className={collapsed ? "slds-hide" : ""}>
				<div dangerouslySetInnerHTML={{__html: content }} />
				<p className="source">
					Original Source: <a href={source}>{source}</a>
				</p>
			</div>
		</article>
	);
}

export default Article;