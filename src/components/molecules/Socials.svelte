<script>
	import Social from '../atoms/Social.svelte';
	import { user } from '../../util/discord';
</script>

<div class="socials-container">
	<Social icon="github" tip="totkyle" link="https://github.com/totkyle" />
	<Social icon="discord" tip={user.username} link={`https://discord.com/users/${user.id}`} />
</div>

<style>
	.socials-container {
		display: flex;
		gap: 0.75rem;
	}
</style>
