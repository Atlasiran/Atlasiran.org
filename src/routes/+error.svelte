<!-- This page handles any error encountered by the site. -->
<script>
	import { page } from "$app/state";
	import { base } from "$lib/sitePaths";
</script>

<h2>{page.status}</h2>
<p class="subhead">{page.error.message}</p>

<p><strong>Sorry!</strong> Maybe try one of these links?</p>
<ul>
	<li><a href="{base}">Home</a></li>
</ul>
