export const GameConfig = {
  WIDTH: 800,    // Giữ màn hình rộng
  HEIGHT: 500,   // Giữ màn hình cao
  BIRD: {
    GRAVITY: 800,
    JUMP_SPEED: -300,
    X_POSITION: 150,  // Điều chỉnh vị trí bird ra xa hơn một chút
    SIZE: 34     // Kích thước thật của bird
  },
  PIPE: {
    SPEED: -150,
    SPAWN_TIME: 2000,
    GAP: 120,    // Khoảng cách giữa hai pipe
    WIDTH: 52,   // Kích thước thật của pipe
    HEIGHT: 320  // Chiều cao thật của pipe
  }
};