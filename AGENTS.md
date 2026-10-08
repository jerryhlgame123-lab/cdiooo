# Workspace Rules

## Quy tắc chạy Server giao diện
- **Ưu tiên hàng đầu**: Khi chạy server để xem/test giao diện, **LUÔN ƯU TIÊN** chạy static web server trỏ trực tiếp vào thư mục `UI` (sử dụng lệnh `npx.cmd -y serve UI -p 3000`). Điều này đảm bảo khi mở `http://localhost:3000` sẽ tự động tải trang `index.html` đầu tiên.
- **Không chạy server frontend (Next.js)** trừ khi người dùng có yêu cầu cụ thể rõ ràng là muốn chạy Next.js.

