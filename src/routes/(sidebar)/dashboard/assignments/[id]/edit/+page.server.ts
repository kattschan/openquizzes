import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, params, locals: { supabase } }) => {
		const formData = await request.formData();
		const { title, description, questions } = await JSON.parse(formData.get('data') as string);

		const { error } = await supabase
			.from('assignments')
			.update({ title, description, questions })
			.eq('id', params.id);
		if (error) {
			console.error(error);
			return { success: false };
		}
		return { success: true };
	}
};

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
