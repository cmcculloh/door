import { FC } from 'react';

type Props = {
    size?: 'xx-small' | 'x-small' | 'small' | 'default' | 'large';
    type: string;
    color?: 'default' | 'error' | 'warning' | 'success' | 'light';// | 'current'; // current color works differently. Look at docs if you need it.
    classNames?: string;
    description?: string;
}

const Icon: FC<Props> = ({ size="default", type, color="default", classNames="", description="" }) => {
    const sizeClass = size === 'default' ? '' : `slds-icon_${size}`;
    return (
		<span
			className={`slds-icon_container slds-icon-utility-${type} ${classNames}`}
			title={description}
		>
			<svg className={`slds-icon ${sizeClass} slds-icon-text-${color}`} aria-hidden="true">
				<use
					xlinkHref={`/salesforce-lightning-design-system-icons/utility-sprite/svg/symbols.svg#${type}`}
				/>
			</svg>
			<span className="slds-assistive-text">{description}</span>
		</span>
	);
};

export default Icon;