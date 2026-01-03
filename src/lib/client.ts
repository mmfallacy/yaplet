import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

// Can't infer via typeof auth as auth is in a server module.
// Consider extracting additional fields instead when more fields are added.
export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields({
			user: {
				username: {
					type: 'string',
					required: true
				}
			}
		})
	]
});
