module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 2: Nghĩa là mức độ Error (chặn commit), 'always': Luôn áp dụng luật này
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Tính năng mới
        'fix',      // Sửa lỗi
        'chore',    // Cập nhật lặt vặt (deps, config)
        'docs',     // Tài liệu, comment
        'style',    // Định dạng code (khoảng trắng, dấu phẩy)
        'refactor', // Cấu trúc lại code
        'perf',     // Tối ưu hiệu năng
        'test',     // Thêm/sửa bài test
        'build',    // Hệ thống build, thư viện ngoài
        'ci',       // Cấu hình GitHub Actions, CI/CD
        'revert'    // Hoàn tác commit cũ
      ],
    ],
    // Bắt buộc viết thường cho type và scope
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    // Không cho phép để trống nội dung mô tả
    'subject-empty': [2, 'never'],
  },
};