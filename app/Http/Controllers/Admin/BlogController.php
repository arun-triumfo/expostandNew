<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AuthorizesAdminDeletes;
use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    use AuthorizesAdminDeletes;

    public function index(Request $request): Response
    {
        $blogs = Article::query()
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(function (Article $article) {
                return [
                    'id' => $article->id,
                    'title' => $article->blog_tilte,
                    'slug' => $article->url,
                    'created_at' => $article->created_date,
                    'status' => $article->status,
                    'status_label' => $article->status == 1 ? 'Active' : 'Inactive',
                ];
            });

        return Inertia::render('Admin/Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:500'],
            'slug' => ['required', 'string', 'max:500', Rule::unique('article', 'url')],
            'blogdesc' => ['nullable', 'string'],
            'alttag' => ['nullable', 'string', 'max:500'],
            'sidebarlmt' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:0,1'],
            'metatitle' => ['nullable', 'string'],
            'metadesc' => ['nullable', 'string'],
            'uploadfile' => ['nullable', 'image', 'max:10240'],
        ]);

        $mainimg = '';
        if ($request->hasFile('uploadfile')) {
            $mainimg = time().'.'.$request->file('uploadfile')->getClientOriginalExtension();
            $request->file('uploadfile')->move(public_path('uploads/blog'), $mainimg);
        }

        Article::query()->create([
            'url' => $this->legacySlug($validated['slug']),
            'blog_tilte' => $validated['title'],
            'description' => $validated['blogdesc'] ?? '',
            'blog_img' => $mainimg,
            'author' => 'Expostandzone.com',
            'meta_title' => $validated['metatitle'] ?? '',
            'meta_desc' => $validated['metadesc'] ?? '',
            'meta_keywords' => '',
            'alt_tag' => $validated['alttag'] ?? '',
            'status' => $validated['status'],
            'bloglimit' => $validated['sidebarlmt'] ?? '',
        ]);

        return redirect()->route('admin.blog.index');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Blog/Edit', [
            'blog' => [
                'id' => $article->id,
                'title' => $article->blog_tilte,
                'slug' => $article->url,
                'blogdesc' => $article->description ?? '',
                'alttag' => $article->alt_tag ?? '',
                'sidebarlmt' => $article->bloglimit ?? '',
                'status' => (string) $article->status,
                'metatitle' => $article->meta_title ?? '',
                'metadesc' => $article->meta_desc ?? '',
                'blog_img' => $article->blog_img ?? '',
            ],
        ]);
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:500'],
            'slug' => ['required', 'string', 'max:500', Rule::unique('article', 'url')->ignore($article->id)],
            'blogdesc' => ['nullable', 'string'],
            'alttag' => ['nullable', 'string', 'max:500'],
            'sidebarlmt' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:0,1'],
            'metatitle' => ['nullable', 'string'],
            'metadesc' => ['nullable', 'string'],
            'uploadfile' => ['nullable', 'image', 'max:10240'],
            'oldcomplogo' => ['nullable', 'string', 'max:255'],
            'clear_existing_logo' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('uploadfile')) {
            $mainimg = time().'.'.$request->file('uploadfile')->getClientOriginalExtension();
            $request->file('uploadfile')->move(public_path('uploads/blog'), $mainimg);
            if (! empty($article->blog_img) && $article->blog_img !== $mainimg) {
                @unlink(public_path('uploads/blog/'.$article->blog_img));
            }
        } elseif ($request->boolean('clear_existing_logo')) {
            if (! empty($article->blog_img)) {
                @unlink(public_path('uploads/blog/'.$article->blog_img));
            }
            $mainimg = '';
        } else {
            $mainimg = $validated['oldcomplogo'] ?? $article->blog_img ?? '';
        }

        $article->update([
            'url' => $this->legacySlug($validated['slug']),
            'blog_tilte' => $validated['title'],
            'description' => $validated['blogdesc'] ?? '',
            'blog_img' => $mainimg,
            'author' => 'Expostandzone.com',
            'meta_title' => $validated['metatitle'] ?? '',
            'meta_desc' => $validated['metadesc'] ?? '',
            'meta_keywords' => '',
            'alt_tag' => $validated['alttag'] ?? '',
            'status' => $validated['status'],
            'bloglimit' => $validated['sidebarlmt'] ?? '',
        ]);

        return redirect()->route('admin.blog.index');
    }

    public function destroy(Request $request, Article $article): RedirectResponse
    {
        $this->authorizeAdminDelete($request);

        if (! empty($article->blog_img)) {
            @unlink(public_path('uploads/blog/'.$article->blog_img));
        }
        $article->delete();

        return redirect()->route('admin.blog.index');
    }

    private function legacySlug(string $input): string
    {
        return str_replace(' ', '-', strtolower(htmlentities($input, ENT_QUOTES, 'UTF-8')));
    }
}
