<template>
	<div v-if="$store.state.connected">
		<p>Current host is: {{ $store.state.host }}</p>
		<p>Current base URI is: {{ $store.getters.uri }}</p>
		<p v-if="$store.state.apiConfig.name"><b>Connected to:</b> {{ $store.state.apiConfig.name }}</p>
	</div>
	<div v-else-if="$store.state.waiting">
		<div uk-spinner></div>
	</div>
	<div v-else-if="$store.state.error">
		Error: {{ $store.state.error }}
	</div>
	<div v-else>
		Enter a hostname and connect to start.
	</div>
</template>