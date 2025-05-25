'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function Home() {
	const [imageBlob, setImageBlob] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [canShare, setCanShare] = useState(false);
	const [isClient, setIsClient] = useState(false);

	const IMAGE_URL = 'https://picsum.photos/200';

	useEffect(() => {
		// Set client-side flag
		setIsClient(true);
		
		// Check if Web Share API is supported
		if (typeof window !== 'undefined' && window.navigator && window.navigator.share && window.navigator.canShare) {
			setCanShare(true);
		}
	}, []);

	const downloadImage = async () => {
		setLoading(true);
		setError(null);
		
		try {
			const response = await fetch(IMAGE_URL);
			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.status}`);
			}
			
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			
			setImageBlob(blob);
			setImageUrl(url);
		} catch (err) {
			setError(err.message);
			alert(`Error downloading image: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	const shareImage = async (method = 'basic') => {
		if (!isClient) {
			alert('Client not ready yet');
			return;
		}

		if (!canShare) {
			alert('Web Share API not supported on this device/browser');
			return;
		}

		if (!imageBlob) {
			alert('Please download the image first');
			return;
		}

		try {
			let shareData = {};

			switch (method) {
				case 'image-only':
					const imageFile = new File([imageBlob], 'shared-image.jpg', { type: 'image/jpeg' });
					shareData = {
						files: [imageFile]
					};
					break;

				case 'image-with-text':
					const imageFileWithText = new File([imageBlob], 'shared-image.jpg', { type: 'image/jpeg' });
					shareData = {
						text: 'Check out this awesome image!',
						files: [imageFileWithText]
					};
					break;

				case 'image-with-title':
					const imageFileWithTitle = new File([imageBlob], 'shared-image.jpg', { type: 'image/jpeg' });
					shareData = {
						title: 'Amazing Random Image',
						files: [imageFileWithTitle]
					};
					break;

				case 'image-with-url':
					const imageFileWithUrl = new File([imageBlob], 'shared-image.jpg', { type: 'image/jpeg' });
					shareData = {
						url: IMAGE_URL,
						files: [imageFileWithUrl]
					};
					break;

				case 'image-complete':
					const imageFileComplete = new File([imageBlob], 'shared-image.jpg', { type: 'image/jpeg' });
					shareData = {
						title: 'Amazing Random Image',
						text: 'Check out this awesome random image from Picsum!',
						url: IMAGE_URL,
						files: [imageFileComplete]
					};
					break;

				case 'text-only':
					shareData = {
						text: 'Check out this awesome image!'
					};
					break;

				case 'title-only':
					shareData = {
						title: 'Amazing Random Image'
					};
					break;

				case 'url-only':
					shareData = {
						url: IMAGE_URL
					};
					break;

				case 'text-and-title':
					shareData = {
						title: 'Amazing Random Image',
						text: 'Check out this awesome random image from Picsum!'
					};
					break;

				case 'text-and-url':
					shareData = {
						text: 'Check out this awesome random image from Picsum!',
						url: IMAGE_URL
					};
					break;

				case 'title-and-url':
					shareData = {
						title: 'Amazing Random Image',
						url: IMAGE_URL
					};
					break;

				case 'all-text-data':
					shareData = {
						title: 'Amazing Random Image',
						text: 'Check out this awesome random image from Picsum!',
						url: IMAGE_URL
					};
					break;

				default:
					shareData = {
						title: 'Test Share',
						text: 'Testing Web Share API'
					};
			}

			// Check if the data can be shared
			if (window.navigator.canShare && !window.navigator.canShare(shareData)) {
				alert(`Cannot share this data combination (${method}). Data: ${JSON.stringify(shareData, null, 2)}`);
				return;
			}

			await window.navigator.share(shareData);
			alert(`Successfully shared using method: ${method}`);
		} catch (err) {
			alert(`Error sharing (${method}): ${err.message}\nError name: ${err.name}`);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">Web Share API Testing</h1>
				
				{/* API Support Status */}
				{isClient && (
					<div className="bg-white rounded-lg shadow p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">API Support Status</h2>
						<div className="space-y-2">
							<p>Navigator available: <span className={typeof window !== 'undefined' && window.navigator ? 'text-green-600' : 'text-red-600'}>{typeof window !== 'undefined' && window.navigator ? 'Yes' : 'No'}</span></p>
							<p>Share API: <span className={typeof window !== 'undefined' && window.navigator && window.navigator.share ? 'text-green-600' : 'text-red-600'}>{typeof window !== 'undefined' && window.navigator && window.navigator.share ? 'Yes' : 'No'}</span></p>
							<p>CanShare API: <span className={typeof window !== 'undefined' && window.navigator && window.navigator.canShare ? 'text-green-600' : 'text-red-600'}>{typeof window !== 'undefined' && window.navigator && window.navigator.canShare ? 'Yes' : 'No'}</span></p>
							<p>Overall Support: <span className={canShare ? 'text-green-600' : 'text-red-600'}>{canShare ? 'Supported' : 'Not Supported'}</span></p>
						</div>
					</div>
				)}

				{/* Image Download Section */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Step 1: Download Image</h2>
					<div className="text-center">
						<Button 
							onClick={downloadImage} 
							disabled={loading}
							className="mb-4"
						>
							{loading ? 'Downloading...' : 'Download Image from Picsum'}
						</Button>
						
						{error && (
							<p className="text-red-600 mb-4">Error: {error}</p>
						)}
						
						{imageUrl && (
							<div>
								<p className="text-green-600 mb-4">✅ Image downloaded successfully!</p>
								<img 
									src={imageUrl} 
									alt="Downloaded from Picsum" 
									className="mx-auto rounded-lg shadow-md max-w-full"
								/>
							</div>
						)}
					</div>
				</div>

				{/* Share Testing Section */}
				{imageBlob && (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Step 2: Test Sharing Methods</h2>
						
						<div className="grid gap-3 md:grid-cols-2">
							{/* Image Sharing Tests */}
							<div className="space-y-2">
								<h3 className="font-medium text-gray-700">Image Sharing:</h3>
								<Button onClick={() => shareImage('image-only')} variant="outline" className="w-full text-sm">
									Share Image Only
								</Button>
								<Button onClick={() => shareImage('image-with-text')} variant="outline" className="w-full text-sm">
									Share Image + Text
								</Button>
								<Button onClick={() => shareImage('image-with-title')} variant="outline" className="w-full text-sm">
									Share Image + Title
								</Button>
								<Button onClick={() => shareImage('image-with-url')} variant="outline" className="w-full text-sm">
									Share Image + URL
								</Button>
								<Button onClick={() => shareImage('image-complete')} variant="outline" className="w-full text-sm">
									Share Image + All Data
								</Button>
							</div>

							{/* Text/Data Sharing Tests */}
							<div className="space-y-2">
								<h3 className="font-medium text-gray-700">Text/Data Sharing:</h3>
								<Button onClick={() => shareImage('text-only')} variant="outline" className="w-full text-sm">
									Share Text Only
								</Button>
								<Button onClick={() => shareImage('title-only')} variant="outline" className="w-full text-sm">
									Share Title Only
								</Button>
								<Button onClick={() => shareImage('url-only')} variant="outline" className="w-full text-sm">
									Share URL Only
								</Button>
								<Button onClick={() => shareImage('text-and-title')} variant="outline" className="w-full text-sm">
									Share Text + Title
								</Button>
								<Button onClick={() => shareImage('text-and-url')} variant="outline" className="w-full text-sm">
									Share Text + URL
								</Button>
								<Button onClick={() => shareImage('title-and-url')} variant="outline" className="w-full text-sm">
									Share Title + URL
								</Button>
								<Button onClick={() => shareImage('all-text-data')} variant="outline" className="w-full text-sm">
									Share All Text Data
								</Button>
							</div>
						</div>

						<div className="mt-6 p-4 bg-gray-50 rounded-lg">
							<h3 className="font-medium text-gray-700 mb-2">Testing Notes:</h3>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Each button tests a different combination of share data</li>
								<li>• Errors will be shown in alerts for mobile testing</li>
								<li>• Success messages will also appear in alerts</li>
								<li>• Test on different devices/browsers to see behavior differences</li>
								<li>• Some combinations may not be supported on all platforms</li>
							</ul>
						</div>
					</div>
				)}

				{isClient && !canShare && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
						<p className="text-yellow-800">
							⚠️ Web Share API is not supported on this browser/device. 
							Try testing on a mobile device or a browser that supports the Web Share API.
						</p>
					</div>
				)}

				{!isClient && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
						<p className="text-blue-800">
							🔄 Loading client-side features...
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
