const pixelSizes = [1920, 1080, 720];

const formats = [
	{
		format: 'horizontal',
		largeFormatWidth: '32px',
		largeFormatHeight: '18px',
		largeFormatSize: `${pixelSizes[0]} x ${pixelSizes[1]}`,
		smallFormatWidth: '18px',
		smallFormatHeight: '12px',
		smallFormatSize: `${pixelSizes[1]} x ${pixelSizes[2]}`,
	},
	{
		format: 'square',
		largeFormatWidth: '18px',
		largeFormatHeight: '18px',
		largeFormatSize: `${pixelSizes[1]} x ${pixelSizes[1]}`,
		smallFormatWidth: '12px',
		smallFormatHeight: '12px',
		smallFormatSize: `${pixelSizes[2]} x ${pixelSizes[2]}`,
	},
	{
		format: 'vertical',
		largeFormatWidth: '18px',
		largeFormatHeight: '32px',
		largeFormatSize: `${pixelSizes[1]} x ${pixelSizes[0]}`,
		smallFormatWidth: '12px',
		smallFormatHeight: '18px',
		smallFormatSize: `${pixelSizes[2]} x ${pixelSizes[1]}`,
	},
];

export { pixelSizes, formats };
