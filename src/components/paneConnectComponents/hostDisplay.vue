<template>
	<div class="host-display">
		<h2>Debug</h2>
		<div v-if="$store.state.connected">
			<p><b>Host:</b> {{ $store.state.host }}</p>
			<p><b>Base URI:</b> {{ $store.getters.uri }}</p>
			<p v-if="$store.state.apiConfig.name"><b>Device name:</b> {{ $store.state.apiConfig.name }}</p>
		</div>
		<div v-else-if="$store.state.waiting">
			<div uk-spinner></div>
		</div>
		<div v-else-if="$store.state.error">
			<b>Error:</b> {{ $store.state.error }}
		</div>
		<div v-else>
			Enter a hostname and connect to start.
		</div>
	</div>
</template>