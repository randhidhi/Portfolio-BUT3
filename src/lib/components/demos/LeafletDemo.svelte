<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale } from '../../../messages/i18n';

	// Static planet data inspired by the Star Wars galaxy
	const planets = [
		{ name: 'Coruscant', x: 248, y: 252, region: 'Core', diameter: 12240 },
		{ name: 'Corellia', x: 230, y: 270, region: 'Core', diameter: 11000 },
		{ name: 'Alderaan', x: 215, y: 240, region: 'Core', diameter: 12500 },
		{ name: 'Chandrila', x: 260, y: 230, region: 'Core', diameter: 13500 },
		{ name: 'Hosnian Prime', x: 235, y: 255, region: 'Core', diameter: 12200 },
		{ name: 'Byss', x: 255, y: 260, region: 'Deep Core', diameter: 10088 },
		{ name: 'Tython', x: 262, y: 248, region: 'Deep Core', diameter: 11400 },
		{ name: 'Naboo', x: 295, y: 200, region: 'Mid Rim Territories', diameter: 12120 },
		{ name: 'Kashyyyk', x: 310, y: 280, region: 'Mid Rim Territories', diameter: 12765 },
		{ name: 'Takodana', x: 195, y: 195, region: 'Mid Rim Territories', diameter: 10500 },
		{ name: 'Onderon', x: 330, y: 230, region: 'Inner Rim Territories', diameter: 14200 },
		{ name: 'Manaan', x: 185, y: 280, region: 'Inner Rim Territories', diameter: 15600 },
		{ name: 'Scarif', x: 280, y: 310, region: 'Outer Rim Territories', diameter: 9112 },
		{ name: 'Tatooine', x: 350, y: 170, region: 'Outer Rim Territories', diameter: 10465 },
		{ name: 'Hoth', x: 340, y: 300, region: 'Outer Rim Territories', diameter: 7200 },
		{ name: 'Endor', x: 370, y: 260, region: 'Outer Rim Territories', diameter: 4900 },
		{ name: 'Mustafar', x: 355, y: 320, region: 'Outer Rim Territories', diameter: 4200 },
		{ name: 'Dagobah', x: 160, y: 310, region: 'Outer Rim Territories', diameter: 8900 },
		{ name: 'Dathomir', x: 380, y: 200, region: 'Outer Rim Territories', diameter: 10460 },
		{ name: 'Kamino', x: 140, y: 350, region: 'Wild Space', diameter: 19720 },
		{ name: 'Ilum', x: 100, y: 170, region: 'Wild Space', diameter: 660 },
		{ name: 'Nal Hutta', x: 365, y: 150, region: 'Hutt Space', diameter: 12150 },
		{ name: 'Nar Shaddaa', x: 375, y: 140, region: 'Hutt Space', diameter: 4100 },
		{ name: 'Jakku', x: 155, y: 155, region: 'Expansion Region', diameter: 6960 },
		{ name: 'Mandalore', x: 310, y: 165, region: 'Outer Rim Territories', diameter: 9200 }
	];

	const regionColors: Record<string, string> = {
		'Core': '#FB8C00',
		'Deep Core': '#D4E157',
		'Expansion Region': '#9E9D24',
		'Hutt Space': '#4DB6AC',
		'Inner Rim Territories': '#00796B',
		'Mid Rim Territories': '#00BCD4',
		'Outer Rim Territories': '#1E88E5',
		'Wild Space': '#EC407A'
	};

	let mapContainer: HTMLDivElement;
	let map: any;
	let routeLayer: any;
	let departurePlanet = $state(planets[0]);
	let arrivalPlanet = $state(planets[13]);

	function getDistance(p1: typeof planets[0], p2: typeof planets[0]): number {
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		return Math.round(Math.sqrt(dx * dx + dy * dy) * 50); // Scale to "parsecs"
	}

	let distance = $derived(getDistance(departurePlanet, arrivalPlanet));

	function drawRoute() {
		if (!map) return;
		if (routeLayer) {
			map.removeLayer(routeLayer);
		}

		const L = (window as any).L;
		const departureCoord = [departurePlanet.y, departurePlanet.x];
		const arrivalCoord = [arrivalPlanet.y, arrivalPlanet.x];

		routeLayer = L.layerGroup();

		// Animated dashed route line
		const routeLine = L.polyline([departureCoord, arrivalCoord], {
			color: '#ffffff',
			weight: 2,
			dashArray: '8, 8',
			opacity: 0.8
		});
		routeLayer.addLayer(routeLine);

		// Departure marker
		const depMarker = L.marker(departureCoord, {
			icon: L.divIcon({
				className: 'custom-marker departure-marker',
				html: `<div class="marker-dot departure"></div>`,
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			})
		}).bindPopup(`<b>🚀 ${departurePlanet.name}</b><br/>Departure`);
		routeLayer.addLayer(depMarker);

		// Arrival marker
		const arrMarker = L.marker(arrivalCoord, {
			icon: L.divIcon({
				className: 'custom-marker arrival-marker',
				html: `<div class="marker-dot arrival"></div>`,
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			})
		}).bindPopup(`<b>🏁 ${arrivalPlanet.name}</b><br/>Arrival`);
		routeLayer.addLayer(arrMarker);

		routeLayer.addTo(map);
	}

	function randomRoute() {
		const idx1 = Math.floor(Math.random() * planets.length);
		let idx2 = Math.floor(Math.random() * planets.length);
		while (idx2 === idx1) {
			idx2 = Math.floor(Math.random() * planets.length);
		}
		departurePlanet = planets[idx1];
		arrivalPlanet = planets[idx2];
		drawRoute();
	}

	onMount(() => {
		// Load Leaflet CSS + JS from CDN
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
		document.head.appendChild(link);

		const script = document.createElement('script');
		script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
		script.onload = () => {
			initMap();
		};
		document.head.appendChild(script);

		return () => {
			if (map) map.remove();
		};
	});

	function initMap() {
		const L = (window as any).L;
		const bounds: [[number, number], [number, number]] = [[50, 50], [450, 450]];

		map = L.map(mapContainer, {
			crs: L.CRS.Simple,
			attributionControl: false,
			zoomSnap: 0.25,
			minZoom: -1,
			maxZoom: 3
		});

		L.imageOverlay('/images/galaxy-map.png', bounds).addTo(map);
		map.fitBounds(bounds);

		// Add planet circles
		for (const planet of planets) {
			const color = regionColors[planet.region] || '#ffffff';
			const radius = Math.max(planet.diameter / 3000, 2);

			L.circle([planet.y, planet.x], {
				color: color,
				fillColor: color,
				fillOpacity: 0.7,
				radius: radius,
				weight: 1.5
			})
				.addTo(map)
				.bindPopup(
					`<div style="font-family: 'Rajdhani', sans-serif; text-align: center;">
						<b style="font-size: 14px;">${planet.name}</b><br/>
						<span style="color: ${color}; font-weight: 600;">${planet.region}</span><br/>
						<span style="font-size: 12px;">⌀ ${planet.diameter.toLocaleString()} km</span>
					</div>`
				);
		}

		drawRoute();
	}
</script>

<div class="demo-wrapper">
	<div class="map-container" bind:this={mapContainer} id="leaflet-map"></div>

	<div class="controls-panel">
		<div class="route-info">
			<div class="route-endpoint">
				<span class="endpoint-label">🚀 {$locale === 'fr' ? 'Départ' : 'Departure'}</span>
				<span class="endpoint-value">{departurePlanet.name}</span>
			</div>
			<div class="route-arrow">→</div>
			<div class="route-endpoint">
				<span class="endpoint-label">🏁 {$locale === 'fr' ? 'Arrivée' : 'Arrival'}</span>
				<span class="endpoint-value">{arrivalPlanet.name}</span>
			</div>
		</div>

		<div class="route-stats">
			<div class="stat">
				<span class="stat-label">Distance</span>
				<span class="stat-value">{distance.toLocaleString()} parsecs</span>
			</div>
			<div class="stat">
				<span class="stat-label">{$locale === 'fr' ? 'Coût estimé' : 'Estimated cost'}</span>
				<span class="stat-value">{(distance * 12).toLocaleString()} crédits</span>
			</div>
		</div>

		<button class="randomize-btn" onclick={randomRoute}>
			🎲 {$locale === 'fr' ? 'Nouveau trajet' : 'New route'}
		</button>
	</div>

	<div class="legend">
		<span class="legend-title">{$locale === 'fr' ? 'Régions' : 'Regions'}</span>
		<div class="legend-items">
			{#each Object.entries(regionColors) as [region, color]}
				<div class="legend-item">
					<span class="legend-dot" style="background: {color}"></span>
					<span class="legend-label">{region}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.demo-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.map-container {
		width: 100%;
		height: 450px;
		border-radius: var(--radius-lg);
		border: 2px solid rgba(192, 192, 192, 0.2);
		overflow: hidden;
		background: var(--color-carbon-dark);
	}

	.controls-panel {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(192, 192, 192, 0.15);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.route-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.route-endpoint {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.endpoint-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.endpoint-value {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-chrome-light);
	}

	.route-arrow {
		font-size: var(--text-2xl);
		color: var(--color-warning-orange);
		font-weight: 700;
	}

	.route-stats {
		display: flex;
		justify-content: center;
		gap: var(--space-8);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-warning-orange);
	}

	.randomize-btn {
		align-self: center;
		padding: var(--space-3) var(--space-6);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: var(--text-base);
		color: var(--color-white);
		background: var(--color-plate-blue);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.randomize-btn:hover {
		background: var(--color-plate-blue-light);
		box-shadow: var(--shadow-glow-blue);
		transform: translateY(-2px);
	}

	.legend {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(192, 192, 192, 0.1);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
	}

	.legend-title {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-chrome);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		display: block;
		margin-bottom: var(--space-2);
	}

	.legend-items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.legend-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	/* Custom Leaflet marker styles */
	:global(.marker-dot) {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	:global(.marker-dot.departure) {
		background: #4caf50;
		box-shadow: 0 0 12px rgba(76, 175, 80, 0.6);
	}

	:global(.marker-dot.arrival) {
		background: #e63946;
		box-shadow: 0 0 12px rgba(230, 57, 70, 0.6);
	}

	:global(.leaflet-popup-content-wrapper) {
		background: rgba(26, 26, 26, 0.95) !important;
		color: #e8e8e8 !important;
		border-radius: 8px !important;
		border: 1px solid rgba(192, 192, 192, 0.2) !important;
	}

	:global(.leaflet-popup-tip) {
		background: rgba(26, 26, 26, 0.95) !important;
	}

	@media (max-width: 640px) {
		.map-container {
			height: 300px;
		}

		.route-stats {
			flex-direction: column;
			gap: var(--space-2);
		}
	}
</style>
