declare namespace Eps {
	interface BaseSysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门名称
		 */
		name?: string;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 上级部门ID
		 */
		parentId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 行为
		 */
		action?: string;

		/**
		 * ip
		 */
		ip?: string;

		/**
		 * 参数
		 */
		params?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单ID
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 菜单地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型 0-目录 1-菜单 2-按钮
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 视图地址
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: boolean;

		/**
		 * 是否显示
		 */
		isShow?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 数据类型 0-字符串 1-富文本 2-文件
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: boolean;

		/**
		 * 菜单权限
		 */
		menuIdList?: any;

		/**
		 * 部门权限
		 */
		departmentIdList?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 密码版本, 作用是改完密码，让原来的token失效
		 */
		passwordV?: number;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * socketId
		 */
		socketId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface HomestayEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 民宿名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		cover?: string;

		/**
		 * 民宿图片（多张）
		 */
		images?: string;

		/**
		 * 民宿简介
		 */
		description?: string;

		/**
		 * 详细地址
		 */
		address?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 联系电话
		 */
		phone?: string;

		/**
		 * 最低价格
		 */
		minPrice?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 标签
		 */
		tags?: string;

		/**
		 * 设施服务
		 */
		facilities?: string;

		/**
		 * 入住时间
		 */
		checkInTime?: string;

		/**
		 * 退房时间
		 */
		checkOutTime?: string;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 浏览量
		 */
		viewCount?: number;

		/**
		 * 订单量
		 */
		orderCount?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoomTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 民宿ID
		 */
		homestayId?: number;

		/**
		 * 房型名称
		 */
		name?: string;

		/**
		 * 房型图片
		 */
		image?: string;

		/**
		 * 房型图片（多张）
		 */
		images?: string;

		/**
		 * 房型描述
		 */
		description?: string;

		/**
		 * 面积（平方米）
		 */
		area?: number;

		/**
		 * 床型
		 */
		bedType?: string;

		/**
		 * 最多入住人数
		 */
		maxGuests?: number;

		/**
		 * 价格/晚
		 */
		price?: number;

		/**
		 * 周末价格/晚
		 */
		weekendPrice?: number;

		/**
		 * 房间设施
		 */
		facilities?: string;

		/**
		 * 房间总数
		 */
		totalRooms?: number;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface OrderEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 订单总金额
		 */
		totalAmount?: number;

		/**
		 * 实付金额
		 */
		payAmount?: number;

		/**
		 * 运费
		 */
		freight?: number;

		/**
		 * 优惠金额
		 */
		discountAmount?: number;

		/**
		 * 订单状态 0-待付款 1-待发货 2-待收货 3-已完成 4-已取消 5-已关闭
		 */
		status?: number;

		/**
		 * 支付状态 0-未支付 1-已支付
		 */
		payStatus?: number;

		/**
		 * 支付方式 wechat-微信 alipay-支付宝
		 */
		payType?: string;

		/**
		 * 支付时间
		 */
		payTime?: string;

		/**
		 * 发货时间
		 */
		shipTime?: string;

		/**
		 * 完成时间
		 */
		finishTime?: string;

		/**
		 * 取消时间
		 */
		cancelTime?: string;

		/**
		 * 取消原因
		 */
		cancelReason?: string;

		/**
		 * 订单备注
		 */
		remark?: string;

		/**
		 * 收货人姓名
		 */
		receiverName?: string;

		/**
		 * 收货人电话
		 */
		receiverPhone?: string;

		/**
		 * 省
		 */
		receiverProvince?: string;

		/**
		 * 市
		 */
		receiverCity?: string;

		/**
		 * 区
		 */
		receiverDistrict?: string;

		/**
		 * 详细地址
		 */
		receiverAddress?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 内容
		 */
		content?: any;

		/**
		 * ts内容
		 */
		tsContent?: any;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: any;

		/**
		 * 配置
		 */
		config?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 父分类ID，0为一级分类
		 */
		parentId?: number;

		/**
		 * 分类图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类ID
		 */
		categoryId?: number;

		/**
		 * 商品标题
		 */
		title?: string;

		/**
		 * 副标题
		 */
		subtitle?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 图片列表（JSON数组）
		 */
		images?: any;

		/**
		 * 商品详情（富文本）
		 */
		detail?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 原价
		 */
		originalPrice?: number;

		/**
		 * 总库存
		 */
		stock?: number;

		/**
		 * 销量
		 */
		sales?: number;

		/**
		 * 评分（1-5）
		 */
		rating?: number;

		/**
		 * 评价数
		 */
		reviewCount?: number;

		/**
		 * 收藏数
		 */
		favoriteCount?: number;

		/**
		 * 浏览数
		 */
		viewCount?: number;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 是否推荐 0-否 1-是
		 */
		isRecommend?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商品ID
		 */
		productId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 用户昵称
		 */
		userNickName?: string;

		/**
		 * 用户头像
		 */
		userAvatar?: string;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 评分（1-5）
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 评价图片（JSON数组）
		 */
		images?: any;

		/**
		 * 购买的规格
		 */
		skuName?: string;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 状态 0-待审核 1-已发布 2-已删除
		 */
		status?: number;

		/**
		 * 商家回复
		 */
		replyContent?: string;

		/**
		 * 回复时间
		 */
		replyTime?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 表
		 */
		entityInfo?: any;

		/**
		 * 操作人
		 */
		userId?: number;

		/**
		 * 被删除的数据
		 */
		data?: any;

		/**
		 * 请求的接口
		 */
		url?: string;

		/**
		 * 请求参数
		 */
		params?: any;

		/**
		 * 删除数据条数
		 */
		count?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RestaurantEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		cover?: string;

		/**
		 * 餐厅图片（多张）
		 */
		images?: string;

		/**
		 * 餐厅简介
		 */
		description?: string;

		/**
		 * 详细地址
		 */
		address?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 联系电话
		 */
		phone?: string;

		/**
		 * 营业时间
		 */
		businessHours?: string;

		/**
		 * 人均消费
		 */
		avgPrice?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 标签
		 */
		tags?: string;

		/**
		 * 设施服务
		 */
		facilities?: string;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 浏览量
		 */
		viewCount?: number;

		/**
		 * 订单量
		 */
		orderCount?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShequCommentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 帖子ID
		 */
		postId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 用户昵称
		 */
		userNickName?: string;

		/**
		 * 用户头像
		 */
		userAvatar?: string;

		/**
		 * 评论内容
		 */
		content?: string;

		/**
		 * 父评论ID（回复评论用）
		 */
		parentId?: number;

		/**
		 * 回复的用户ID
		 */
		replyUserId?: number;

		/**
		 * 回复的用户昵称
		 */
		replyUserNickName?: string;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 状态 0-待审核 1-已发布 2-已删除
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShequPostEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 用户昵称
		 */
		userNickName?: string;

		/**
		 * 用户头像
		 */
		userAvatar?: string;

		/**
		 * 帖子内容
		 */
		content?: string;

		/**
		 * 图片列表（JSON数组）
		 */
		images?: any;

		/**
		 * 定位地址
		 */
		location?: string;

		/**
		 * 经度
		 */
		longitude?: number;

		/**
		 * 纬度
		 */
		latitude?: number;

		/**
		 * 景点ID
		 */
		scenicId?: number;

		/**
		 * 景点名称
		 */
		scenicName?: string;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 评论数
		 */
		commentCount?: number;

		/**
		 * 浏览数
		 */
		viewCount?: number;

		/**
		 * 分享数
		 */
		shareCount?: number;

		/**
		 * 状态 0-待审核 1-已发布 2-已下架
		 */
		status?: number;

		/**
		 * 是否精华 0-否 1-是
		 */
		isEssence?: number;

		/**
		 * 是否置顶 0-否 1-是
		 */
		isTop?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 审核备注
		 */
		auditRemark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: number;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: number;

		/**
		 * 文档版本
		 */
		version?: number;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: Date;

		/**
		 * 结束时间
		 */
		endDate?: Date;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 状态 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: Date;

		/**
		 * 状态 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * undefined
		 */
		lastExecuteTime?: Date;

		/**
		 * undefined
		 */
		lockExpireTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AttractionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 景点/活动名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		cover?: string;

		/**
		 * 景点图片（多张）
		 */
		images?: string;

		/**
		 * 景点简介
		 */
		description?: string;

		/**
		 * 详细介绍
		 */
		detailContent?: string;

		/**
		 * 详细地址
		 */
		address?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 联系电话
		 */
		phone?: string;

		/**
		 * 开放时间
		 */
		openTime?: string;

		/**
		 * 最低价格
		 */
		minPrice?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 标签
		 */
		tags?: string;

		/**
		 * 游玩贴士
		 */
		tips?: string;

		/**
		 * 交通指南
		 */
		traffic?: string;

		/**
		 * 类型 1-景点 2-活动
		 */
		type?: number;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 浏览量
		 */
		viewCount?: number;

		/**
		 * 订单量
		 */
		orderCount?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TicketOrderEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 景点ID
		 */
		attractionId?: number;

		/**
		 * 景点名称
		 */
		attractionName?: string;

		/**
		 * 票型ID
		 */
		ticketTypeId?: number;

		/**
		 * 票型名称
		 */
		ticketTypeName?: string;

		/**
		 * 购买数量
		 */
		quantity?: number;

		/**
		 * 使用日期
		 */
		useDate?: string;

		/**
		 * 联系人
		 */
		contactName?: string;

		/**
		 * 联系电话
		 */
		contactPhone?: string;

		/**
		 * 身份证号
		 */
		contactIdCard?: string;

		/**
		 * 订单总金额
		 */
		totalAmount?: number;

		/**
		 * 实付金额
		 */
		payAmount?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-待付款 1-待使用 2-已使用 3-已完成 4-已取消 5-已退款
		 */
		status?: number;

		/**
		 * 支付状态 0-未支付 1-已支付
		 */
		payStatus?: number;

		/**
		 * 支付时间
		 */
		payTime?: string;

		/**
		 * 使用时间
		 */
		useTime?: string;

		/**
		 * 退款时间
		 */
		refundTime?: string;

		/**
		 * 退款原因
		 */
		refundReason?: string;

		/**
		 * 取消原因
		 */
		cancelReason?: string;

		/**
		 * 二维码
		 */
		qrCode?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TicketTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 景点ID
		 */
		attractionId?: number;

		/**
		 * 票型名称
		 */
		name?: string;

		/**
		 * 票型描述
		 */
		description?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 原价
		 */
		originalPrice?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 有效天数
		 */
		validDays?: number;

		/**
		 * 退改规则
		 */
		refundRule?: string;

		/**
		 * 使用规则
		 */
		useRule?: string;

		/**
		 * 状态 0-下架 1-上架
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 收货人姓名
		 */
		receiverName?: string;

		/**
		 * 收货人电话
		 */
		receiverPhone?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 详细地址
		 */
		address?: string;

		/**
		 * 是否默认 0-否 1-是
		 */
		isDefault?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 登录唯一ID
		 */
		unionid?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 登录方式
		 */
		loginType?: number;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: BaseSysLogEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: BaseSysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: BaseSysParamEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: BaseSysRoleEntity[];
	}

	interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: BaseSysUserEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface ProductCategoryPageResponse {
		pagination: PagePagination;
		list: ProductCategoryEntity[];
	}

	interface ProductProductPageResponse {
		pagination: PagePagination;
		list: ProductEntity[];
	}

	interface ProductReviewPageResponse {
		pagination: PagePagination;
		list: ProductReviewEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
	}

	interface ShequCommentPageResponse {
		pagination: PagePagination;
		list: ShequCommentEntity[];
	}

	interface ShequPostPageResponse {
		pagination: PagePagination;
		list: ShequPostEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface OrderOrderPageResponse {
		pagination: PagePagination;
		list: OrderEntity[];
	}

	interface HomestayHomestayPageResponse {
		pagination: PagePagination;
		list: HomestayEntity[];
	}

	interface HomestayRoom_typePageResponse {
		pagination: PagePagination;
		list: RoomTypeEntity[];
	}

	interface RestaurantRestaurantPageResponse {
		pagination: PagePagination;
		list: RestaurantEntity[];
	}

	interface TicketAttractionPageResponse {
		pagination: PagePagination;
		list: AttractionEntity[];
	}

	interface TicketTicket_orderPageResponse {
		pagination: PagePagination;
		list: TicketOrderEntity[];
	}

	interface TicketTicket_typePageResponse {
		pagination: PagePagination;
		list: TicketTypeEntity[];
	}

	interface BaseCoding {
		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Request;
	}

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Request;
	}

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysParam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得所有字典类型
		 */
		types(data?: any): Promise<any>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PluginInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ProductCategory {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductCategoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductCategoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ProductCategoryPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ProductProduct {
		/**
		 * 更新商品状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 设置推荐
		 */
		setRecommend(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ProductProductPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			setRecommend: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			setRecommend: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ProductReview {
		/**
		 * 审核评价
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 回复评价
		 */
		replyReview(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ProductReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			replyReview: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			replyReview: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Request;
	}

	interface ShequComment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShequCommentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShequCommentPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { delete: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface ShequPost {
		/**
		 * 审核帖子
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 设置精华
		 */
		setEssence(data?: any): Promise<any>;

		/**
		 * 设置置顶
		 */
		setTop(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShequPostEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShequPostEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShequPostPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			setEssence: string;
			setTop: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			setEssence: boolean;
			setTop: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TaskInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;

		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;

		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAddress {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface OrderOrder {
		/**
		 * 订单详情
		 */
		detail(data?: any): Promise<any>;

		/**
		 * 取消订单
		 */
		cancel(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 订单发货
		 */
		ship(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OrderEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OrderEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OrderOrderPageResponse>;

		/**
		 * 权限标识
		 */
		permission: {
			detail: string;
			cancel: string;
			delete: string;
			ship: string;
			info: string;
			list: string;
			page: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			detail: boolean;
			cancel: boolean;
			delete: boolean;
			ship: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface HomestayHomestay {
		/**
		 * 更新状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<HomestayEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<HomestayEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<HomestayHomestayPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface HomestayRoom_type {
		/**
		 * 更新状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RoomTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<RoomTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<HomestayRoom_typePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RestaurantRestaurant {
		/**
		 * 更新状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RestaurantEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<RestaurantEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<RestaurantRestaurantPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TicketAttraction {
		/**
		 * 更新状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AttractionEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AttractionEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TicketAttractionPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TicketTicket_order {
		/**
		 * 核销门票
		 */
		verify(data?: any): Promise<any>;

		/**
		 * 退款
		 */
		refund(data?: any): Promise<any>;

		/**
		 * 取消订单
		 */
		cancel(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TicketOrderEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TicketOrderEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TicketTicket_orderPageResponse>;

		/**
		 * 权限标识
		 */
		permission: {
			verify: string;
			refund: string;
			cancel: string;
			delete: string;
			info: string;
			list: string;
			page: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			verify: boolean;
			refund: boolean;
			cancel: boolean;
			delete: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface TicketTicket_type {
		/**
		 * 更新状态
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TicketTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TicketTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TicketTicket_typePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	type DictKey = "brand" | "occupation";

	type Service = {
		request: Request;

		base: {
			coding: BaseCoding;
			comm: BaseComm;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		dict: { info: DictInfo; type: DictType };
		plugin: { info: PluginInfo };
		product: { category: ProductCategory; product: ProductProduct; review: ProductReview };
		recycle: { data: RecycleData };
		shequ: { comment: ShequComment; post: ShequPost };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: { address: UserAddress; info: UserInfo };
		order: { order: OrderOrder };
		homestay: { homestay: HomestayHomestay; room_type: HomestayRoom_type };
		restaurant: { restaurant: RestaurantRestaurant };
		ticket: {
			attraction: TicketAttraction;
			ticket_order: TicketTicket_order;
			ticket_type: TicketTicket_type;
		};
	};
}
