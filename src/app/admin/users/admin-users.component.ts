import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Users</h1>
        <p class="mt-1 text-stone-500">Students, instructors, and admins</p>
      </div>
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table class="min-w-full divide-y divide-stone-200">
          <thead class="bg-stone-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Name</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Email</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Role</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            @for (u of users(); track u.id) {
              <tr class="hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-stone-900">{{ u.name }}</td>
                <td class="px-4 py-3 text-sm text-stone-600">{{ u.email }}</td>
                <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" [class.bg-indigo-100]="u.role === 'student'" [class.bg-teal-100]="u.role === 'instructor'" [class.bg-amber-100]="u.role === 'admin'">{{ u.role }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (loading()) {
        <p class="text-stone-500">Loading...</p>
      }
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  users = signal<UserRow[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.http.get<Array<{ id: number; name: string; email: string; role: string }>>(this.apiUrl).subscribe({
      next: (list) => this.users.set(list.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role ?? 'student' }))),
      error: () => this.users.set([]),
      complete: () => this.loading.set(false),
    });
  }
}
