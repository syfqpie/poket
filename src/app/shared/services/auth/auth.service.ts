import { Injectable } from '@angular/core';
import {
	AuthSession,
	createClient,
	SignInWithPasswordCredentials,
	SignUpWithPasswordCredentials,
	SupabaseClient,
	UserAttributes,
} from '@supabase/supabase-js';

import { environment } from 'src/environments/environment';
import { QueryKey, RedirectFrom } from './auth.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	// Supabase
	public supabase: SupabaseClient
	public _session?: AuthSession | null

	constructor() {
		this.supabase = createClient(environment.supabaseUrl,
									 environment.supabaseKey)
	}

	/**
	 * Get current session.
	 * 
	 * @returns supabase getSession()
	 */
	async getSession() {
		return await this.supabase.auth.getSession()
			.then(({ data, error }) => {
				this._session = data.session
				
				if (error) {
					throw error
				}
			})
	}

	/**
	 * Register new user.
	 * 
	 * @returns supabase signUp()
	 */
	async register(payload: SignUpWithPasswordCredentials) {
		return await this.supabase.auth.signUp(payload)
			.then(({ data, error }) => {
				this._session = data.session

				if (error) {
					throw error
				}
			})
	}

	/**
	 * Signin user.
	 * 
	 * @returns supabase signInWithPassword()
	 */
	async login(payload: SignInWithPasswordCredentials) {
		return await this.supabase.auth.signInWithPassword(payload)
			.then(({ data, error }) => {
				this._session = data.session

				if (error) {
					throw error
				}
			})
	}

	/**
	 * Signout user.
	 * 
	 * @returns supabase signOut()
	 */
	async logout() {
		return await this.supabase.auth.signOut()
			.finally(() => {
				this._session = undefined
			})
	}

	/**
	 * Refresh current session.
	 * 
	 * @param payload.refresh_token current session refresh token
	 * 
	 * @returns supabase refreshSession()
	 */
	async refreshSession(payload?: { refresh_token: string }) {
		return await this.supabase.auth.refreshSession(payload)
			.then(({ data, error }) => {
				this._session = data.session

				if (error) {
					throw error
				}
			})
	}

	/**
	 * Request for password reset.
	 * 
	 * @param email user email
	 * 
	 * @returns supabase resetPasswordForEmail()
	 */
	async resetPassword(email: string) {
		const queryParam = `?${ QueryKey.REDIRECT }=${ RedirectFrom.RESET }`
		const settingsPath = 'settings'
		const redirectToPath = `${ environment.baseDomain }${ settingsPath }${ queryParam }`
		const opts = { redirectTo: redirectToPath }

		return await this.supabase.auth.resetPasswordForEmail(email, opts)
			.then(({ error }) => {
				this._session = undefined

				if (error) {
					throw error
				}
			})
	}

	/**
	 * Update user account attributes
	 * 
	 * TODO:
	 * 	1. Handle different errors
	 * 
	 * @param payload user attributes
	 * 
	 * @returns supabase updateUser
	 */
	async patchUser(payload: UserAttributes) {
		return await this.supabase.auth.updateUser(payload)
			.then(({ error }) => {
				this._session = undefined

				if (error) {
					throw error
				}
			})
	}

}
