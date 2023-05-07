import {get, post, put, del} from '@/api/index';
import type { UserInfo } from '@/types';
import qs from 'qs'

export async function login(data: UserInfo) {
    const response = await post('/login', qs.stringify(data));
    return response.data;
}