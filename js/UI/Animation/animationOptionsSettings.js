/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
		smallFormatWidth: '13px',
		smallFormatHeight: '13px',
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

export { formats };
