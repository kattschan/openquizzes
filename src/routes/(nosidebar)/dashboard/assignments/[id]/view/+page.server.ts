import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { data: assignment, error: assignmentError } = await supabase
		.from('assignments')
		.select()
		.eq('id', params.id)
		.single();

	if (assignmentError || !assignment) {
		throw error(404, {
			message: assignmentError?.message || 'Assignment not found'
		});
	}

	return {
		assignment,
		user
	};
};
