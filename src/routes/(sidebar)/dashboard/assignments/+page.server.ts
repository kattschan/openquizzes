import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { invalidateAll } from '$app/navigation';

export const actions: Actions = {
	default: async ({ locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		const { data, error: insertError } = await supabase
			.from('assignments')
			.insert([
				{
					title: 'New Assignment',
					description: ''
				}
			])
			.select();

		if (insertError) {
			throw error(500, {
				message: insertError.message
			});
		}

		return { success: true };
	}
};
