'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
    });

    const mutation = useMutation({
        mutationFn: async (values: SignUpValues) => {
            const { error } = await signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
            });
            if (error) throw new Error(error.message || 'Failed to sign up');
        },
        onSuccess: () => {
            router.push('/');
        },
    });

    return (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    {...register('password')}
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {mutation.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    {mutation.error.message}
                </div>
            )}

            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
                {mutation.isPending ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    );
}
