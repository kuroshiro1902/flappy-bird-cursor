export const GameConfig = {
  WIDTH: 800,
  HEIGHT: 500,
  
  BIRD: {
    GRAVITY: 800,
    JUMP_SPEED: -300,
    X_POSITION: 150,
    SIZE: 34,
    ROTATION_FACTOR: 0.1,   // Hệ số xoay của bird
    MAX_ANGLE: 30,         // Góc xoay tối đa
    MIN_ANGLE: -30        // Góc xoay tối thiểu
  },

  PIPE: {
    SPEED: -150,
    SPAWN_TIME: 2000,      // 2 giây
    GAP: 120,             // Khoảng cách giữa 2 pipe
    WIDTH: 52,
    HEIGHT: 320,
    MIN_Y: 100,           // Vị trí Y tối thiểu
    MARGIN_BOTTOM: 100,   // Khoảng cách với đáy màn hình
    DESTROY_DELAY: 5000   // Thời gian tự hủy (5 giây)
  },

  SCORE: {
    TRIGGER_WIDTH: 2,     // Độ rộng của trigger
    TRIGGER_PADDING: 10,  // Khoảng đệm của trigger
    X: 16,               // Vị trí X của text score
    Y: 16,               // Vị trí Y của text score
    FONT_SIZE: '32px',
    COLOR: '#fff'
  },
  GAME_OVER: {
    FONT_SIZE: '48px',
    COLOR: '#fff',
    TEXT: 'Game Over\nClick to restart'
  },
  SKILL: {
    DASH_DISTANCE: 220,     // Khoảng cách lướt
    DASH_DURATION: 300,     // Thời gian lướt (ms)
    RAGE_REQUIRED: 5,      // Số điểm nộ cần để dùng skill
    KEY: 'D'               // Phím để dùng skill
  }
};